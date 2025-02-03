import { BigNumberish } from 'ethers'

export type Locale = 'en' | 'ja' | 'cn' | 'es' | 'fr' | 'pt'

export type PagePropsWithLocale<T> = T & {
  params: { locale: Locale }
}

export interface SVGProps {
  sizeClass?: string
  colorClass?: string
  className?: string
}

export interface Contributor {
  contributor: string | null
  totalAmount: BigNumberish
  id?: string
}

export interface Proposal {
  id: string | null
  amount: BigNumberish
}

export interface Section {
  [key: string]: string
}

export interface Dictionary {
  navigation: Section
  dashboard: Section
  proposal: Section
  sidebar: Section
  home: Section
  submit: Section
  vote: Section
  token: Section
  bounty: Section
  pipBar: Section
  pending: Section
  closed: Section
  delegate: Section
  faq: Section
  daofaq: Section
}
