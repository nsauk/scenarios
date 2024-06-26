import React, { useState } from 'react'

import { Company } from '@/lib/types'
import { siteConfig } from '@/config/site'
import DataRepo from '@/lib/data-repo'

export const CompaniesContext = React.createContext({})

export interface CompaniesContextType {
  dataRepo: any
  companies: Company[]
  setCompanies: (_: Company[]) => void
}

export default function CompaniesProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const dataRepo = new DataRepo('companies')

  const loadCompanies = () => {
    if (localStorage.companies === undefined) {
      const initialCompanies = siteConfig.seed.companies as Company[]
      dataRepo.putAll(initialCompanies)
      return initialCompanies
    } else {
      return dataRepo.getAll() as Company[]
    }
  }

  const [companies, setCompanies] = useState(loadCompanies())

  return (
    <CompaniesContext.Provider value={{ dataRepo, companies, setCompanies }}>
      {children}
    </CompaniesContext.Provider>
  )
}
