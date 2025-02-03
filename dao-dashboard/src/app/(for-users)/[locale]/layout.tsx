import { Inter } from 'next/font/google'

import AppBar from '~/components/common/app-bar'
import { cn } from '~/components/utils'
import { PagePropsWithLocale } from '~/i18n/types'
import './for-users-any-locale.css'

const inter = Inter({ subsets: ['latin'] })

export default function ForUsersAnyLocaleIndexLayout({
  children,
  params: { locale },
}: PagePropsWithLocale<{
  children: React.ReactNode
}>) {
  return (
    <div
      className={cn(
        'grid h-[100vh] grid-rows-layout-shell custom-gradient',
        inter.className
      )}
    >
      <AppBar locale={locale} />
      <main className="overflow-y-auto">
        <div className="container py-4 items-center flex flex-col">
          {children}
        </div>
      </main>
    </div>
  )
}
