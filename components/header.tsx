'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'

import { cn } from '@/lib/utils'
import { Icons } from '@/components/icons'
import { siteConfig } from '@/config/site'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Scenario } from '@/lib/types'

export default function Header() {
  const { scenario, connection } = useParams<{
    scenario?: string
    connection?: string
  }>()
  const activeScenario = siteConfig.scenarios.find(
    (i) => i.slug === scenario,
  ) as Scenario

  return (
    <div className='flex gap-3 md:gap-5'>
      <Link href='/' className='items-center space-x-2 flex'>
        <Icons.logo />
        <span
          className={cn(
            'font-bold sm:inline-block md:inline-block',
            scenario ? 'hidden' : '',
          )}
        >
          {siteConfig.name}
        </span>
      </Link>
      <Breadcrumb>
        <BreadcrumbList className='items-center space-x-2 mt-1 flex'>
          {scenario && (
            <>
              <BreadcrumbSeparator>
                <Icons.slash />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <Link href={`/${scenario}`}>{activeScenario?.name}</Link>
              </BreadcrumbItem>
            </>
          )}
          {connection && (
            <>
              <BreadcrumbSeparator>
                <Icons.slash />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <Link href={`/${scenario}/${connection}`}>{connection}</Link>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}
