import {
  createBrowserRouter,
  LoaderFunction,
  LoaderFunctionArgs,
} from 'react-router-dom'

import GeneralError from './(for-users)/[locale]/errors/general-error'

import { Locale } from '~/i18n/types'
let _locale: Locale = 'en'

const loadComponent = async (key: string) => {
  let Component

  switch (key) {
    case 'app-shell':
      Component = (await import('~/components/app-shell')).default
      break
    case 'delegate':
      Component = (await import('./(for-users)/[locale]/delegate/page')).default
      break
    case 'submit':
      Component = (await import('./(for-users)/[locale]/submit/page')).default
      break
    case 'closed':
      Component = (await import('./(for-users)/[locale]/closed/page')).default
      break
    case 'pending':
      Component = (await import('./(for-users)/[locale]/pending/page')).default
      break
    case 'pip':
      Component = (await import('./(for-users)/[locale]/pip/page')).default
      break
    case 'bounty':
      Component = (await import('./(for-users)/[locale]/bounty/page')).default
      break
    case 'token':
      Component = (await import('./(for-users)/[locale]/token/page')).default
      break
    case 'proposals':
      Component = (await import('./(for-users)/[locale]/proposals/page'))
        .default
      break
    case 'dashboard':
      Component = (await import('./(for-users)/[locale]/page')).default
      break
    case 'dao':
      Component = (await import('./(for-users)/[locale]/dao/page')).default
      break
    case 'dao_detail':
      Component = (await import('./(for-users)/[locale]/dao/detail/[id]/page'))
        .default
      break
    case 'pip-all':
      Component = (await import('./(for-users)/[locale]/pip/all/page')).default
      break
    case 'pip-core':
      Component = (await import('./(for-users)/[locale]/pip/core/page')).default
      break
    case 'pip-networking':
      Component = (await import('./(for-users)/[locale]/pip/networking/page'))
        .default
      break
    case 'pip-interface':
      Component = (await import('./(for-users)/[locale]/pip/interface/page'))
        .default
      break
    case 'pip-meta':
      Component = (await import('./(for-users)/[locale]/pip/meta/page')).default
      break
    case 'pip-info':
      Component = (
        await import('./(for-users)/[locale]/pip/informational/page')
      ).default
      break
    case 'pip-prc':
      Component = (await import('./(for-users)/[locale]/pip/prc/page')).default
      break
    case 'faq':
      Component = (await import('./(for-users)/[locale]/faq/page')).default
      break
    case 'daofaq':
      Component = (await import('./(for-users)/[locale]/daofaq/page')).default
      break
    default:
      Component = (await import('~/components/app-shell')).default
      break
  }

  return Component
}

const createLoader =
  (key: string): LoaderFunction =>
  async (args: LoaderFunctionArgs) => {
    const { params } = args
    const { locale } = params
    _locale = locale as Locale
    const PageComponent = await loadComponent(key)
    return {
      Component: <PageComponent params={{ locale: locale as Locale }} />,
    }
  }

const createLazy = (key: string) => async () => {
  const PageComponent = await loadComponent(key)
  return {
    Component: (props: any) => (
      <PageComponent {...props} params={{ locale: _locale }} />
    ),
  }
}

const router = createBrowserRouter([
  // Auth routes
  {
    path: '/:locale/error',
    lazy: async () => ({
      Component: (
        await import('./(for-users)/[locale]/errors/maintenance-error')
      ).default,
    }),
  },

  // Main routes
  {
    path: '/:locale',
    loader: createLoader('app-shell'),
    lazy: createLazy('app-shell'),
    errorElement: <div></div>,
    children: [
      {
        index: true,
        loader: createLoader('dashboard'),
        lazy: createLazy('dashboard'),
      },
      {
        path: '/:locale/dao',
        loader: createLoader('dao'),
        lazy: createLazy('dao'),
      },
      {
        path: '/:locale/daofaq',
        loader: createLoader('daofaq'),
        lazy: createLazy('daofaq'),
      },
      {
        path: '/:locale/dao/detail/:id',
        loader: createLoader('dao_detail'),
        lazy: createLazy('dao_detail'),
      },
      {
        path: '/:locale/proposals',
        loader: createLoader('proposals'),
        lazy: createLazy('proposals'),
      },
      {
        path: '/:locale/token',
        loader: createLoader('token'),
        lazy: createLazy('token'),
      },
      {
        path: '/:locale/bounty',
        loader: createLoader('bounty'),
        lazy: createLazy('bounty'),
      },
      {
        path: '/:locale/pip',
        loader: createLoader('pip'),
        lazy: createLazy('pip'),
      },
      {
        path: '/:locale/pending',
        loader: createLoader('pending'),
        lazy: createLazy('pending'),
      },
      {
        path: '/:locale/closed',
        loader: createLoader('closed'),
        lazy: createLazy('closed'),
      },
      {
        path: '/:locale/submit',
        loader: createLoader('submit'),
        lazy: createLazy('submit'),
      },
      {
        path: '/:locale/delegate',
        loader: createLoader('delegate'),
        lazy: createLazy('delegate'),
      },
      {
        path: '/:locale/pip/all',
        loader: createLoader('pip-all'),
        lazy: createLazy('pip-all'),
      },
      {
        path: '/:locale/pip/core',
        loader: createLoader('pip-core'),
        lazy: createLazy('pip-core'),
      },
      {
        path: '/:locale/pip/informational',
        loader: createLoader('pip-info'),
        lazy: createLazy('pip-info'),
      },
      {
        path: '/:locale/pip/meta',
        loader: createLoader('pip-meta'),
        lazy: createLazy('pip-meta'),
      },
      {
        path: '/:locale/pip/networking',
        loader: createLoader('pip-networking'),
        lazy: createLazy('pip-networking'),
      },
      {
        path: '/:locale/pip/prc',
        loader: createLoader('pip-prc'),
        lazy: createLazy('pip-prc'),
      },
      {
        path: '/:locale/pip/interface',
        loader: createLoader('pip-interface'),
        lazy: createLazy('pip-interface'),
      },
      {
        path: '/:locale/faq',
        loader: createLoader('fqa'),
        lazy: createLazy('faq'),
      },
      {
        path: '/:locale/daofaq',
        loader: createLoader('daofaq'),
        lazy: createLazy('daofaq'),
      },
    ],
  },

  // Fallback 404 route
  { path: '*', Component: GeneralError },
])

export default router
