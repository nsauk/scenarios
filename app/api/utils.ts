import { NextResponse } from 'next/server'
import { DataRecord, IntegrationAppClient } from '@integration-app/sdk'
import jwt from 'jsonwebtoken'

import { WORKSPACE_KEY, WORKSPACE_SECRET } from '@/lib/workspace'
import dbCollection from '@/lib/mongodb'

type Data = {
  event: 'created' | 'updated' | 'deleted'
  id: string
  source: string
  record: DataRecord
}

export function verifyToken(request: Request) {
  const token = request.headers.get('x-integration-app-token')
  if (!token) {
    throw new Error('Token not provided')
  }
  const jwtPayload = jwt.verify(token, WORKSPACE_SECRET) as jwt.JwtPayload
  if (jwtPayload.iss !== WORKSPACE_KEY) {
    throw new Error('Wrong workspace and/or URL')
  }
  return { token: token, jwtPayload: jwtPayload }
}

export async function getSelf(token: string) {
  const integrationApp = new IntegrationAppClient({ token: token })
  const self = await integrationApp.self.get()

  return self
}

export function handleError(error: any, status: number) {
  return NextResponse.json({ error: error.message }, { status: status })
}

export async function handleEvent(userId: string, model: string, data: Data) {
  const collection = await dbCollection(model)
  const commonFields = {
    env: process.env.NODE_ENV,
    integrationKey: data.source,
    userId: userId,
    id: data.id,
  }

  let result
  switch (data.event) {
    case 'created':
    case 'updated':
      result = await collection.updateOne(
        commonFields,
        {
          $set: {
            ...commonFields,
            ...data.record,
            updatedAt: Date.now(),
          },
        },
        { upsert: true },
      )
      break
    case 'deleted':
      result = await collection.deleteOne(commonFields)
      break

    default:
      throw new Error('Invalid event')
  }

  return result
}
