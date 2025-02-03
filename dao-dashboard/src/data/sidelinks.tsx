import {
  IconApps,
  IconChecklist,
  IconHexagonNumber1,
  IconHexagonNumber2,
  IconHexagonNumber3,
  IconHexagonNumber4,
  IconHexagonNumber5,
  IconLayoutDashboard,
  IconMessages,
  IconUserShield,
  IconHexagonNumber7,
  IconHexagonNumber6,
} from '@tabler/icons-react'

import { Locale, Dictionary } from '~/i18n/types'

import { useEffect, useState } from 'react'
import { getDict } from '~/i18n/get-dict'

export interface NavLink {
  title: string
  label?: string
  href: string
  icon: JSX.Element
}

export interface SideLink extends NavLink {
  sub?: NavLink[]
}

export const useSideLinks = (locale: Locale): SideLink[] => {
  const [dict, setDict] = useState<Dictionary | null>(null)
  const sidebar = dict?.sidebar ?? {}
  const faqTitle = dict?.faq.title ?? 'FAQ'

  useEffect(() => {
    const fetchDict = async () => {
      try {
        const fetchedDict = await getDict(locale)
        setDict(fetchedDict)
      } catch (error) {
        console.error('Error fetching dictionary:', error)
      }
    }
    fetchDict()
  }, [locale])

  return [
    {
      title: sidebar.dashboard ?? 'Dashboard',
      label: '',
      href: '/',
      icon: <IconLayoutDashboard size={18} />,
    },
    {
      title: sidebar.dao ?? 'DAO Studio',
      label: '',
      href: '/dao',
      icon: <IconChecklist size={18} />,
      sub: [
        {
          title: 'Studio',
          label: '',
          href: '/dao',
          icon: <IconHexagonNumber1 size={18} />,
        },
        {
          title: 'FAQ',
          label: '',
          href: '/daofaq',
          icon: <IconHexagonNumber2 size={18} />,
        },
      ],
    },
    {
      title: sidebar.proposals ?? 'Proposals',
      label: '',
      href: '/proposals',
      icon: <IconChecklist size={18} />,
      sub: [
        {
          title: sidebar.delegate ?? 'Delegate',
          label: '',
          href: '/delegate',
          icon: <IconHexagonNumber1 size={18} />,
        },
        {
          title: sidebar.submit ?? 'Submit',
          label: '',
          href: '/submit',
          icon: <IconHexagonNumber2 size={18} />,
        },
        {
          title: sidebar.pending ?? 'Pending',
          label: '',
          href: '/pending',
          icon: <IconHexagonNumber3 size={18} />,
        },
        {
          title: sidebar.closed ?? 'Closed',
          label: '',
          href: '/closed',
          icon: <IconHexagonNumber4 size={18} />,
        },
      ],
    },
    {
      title: sidebar.token ?? 'Token',
      label: '',
      href: '/token',
      icon: <IconMessages size={18} />,
    },
    {
      title: sidebar.bounty ?? 'Bounty',
      label: '',
      href: '/bounty',
      icon: <IconApps size={18} />,
    },
    {
      title: sidebar.pip ?? 'PIP',
      label: '',
      href: '/pip',
      icon: <IconUserShield size={18} />,
      sub: [
        {
          title: 'About',
          label: '',
          href: '/pip/',
          icon: <IconHexagonNumber1 size={18} />,
        },
        {
          title: 'All',
          label: '',
          href: '/pip/all',
          icon: <IconHexagonNumber2 size={18} />,
        },
        {
          title: 'Networking',
          label: '',
          href: '/pip/networking',
          icon: <IconHexagonNumber3 size={18} />,
        },
        {
          title: 'Interface',
          label: '',
          href: '/pip/interface',
          icon: <IconHexagonNumber4 size={18} />,
        },
        {
          title: 'PRC',
          label: '',
          href: '/pip/prc',
          icon: <IconHexagonNumber5 size={18} />,
        },
        {
          title: 'Meta',
          label: '',
          href: '/pip/meta',
          icon: <IconHexagonNumber6 size={18} />,
        },
        {
          title: 'Informational',
          label: '',
          href: '/pip/informational',
          icon: <IconHexagonNumber7 size={18} />,
        },
      ],
    },
    {
      title: faqTitle,
      label: '',
      href: '/faq',
      icon: <IconApps size={18} />,
    },
  ]
}
