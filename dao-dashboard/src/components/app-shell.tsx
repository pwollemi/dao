'use client'

import { Outlet } from 'react-router-dom'
import Sidebar from './sidebar'
import useIsCollapsed from '~/hooks/use-is-collapsed'
import { PagePropsWithLocale } from '~/i18n/types'
import AppBar from './common/app-bar'

export default function AppShell({
  params: { locale, ...params },
}: PagePropsWithLocale<{}>) {
  const [isCollapsed, setIsCollapsed] = useIsCollapsed()
  return (
    <div className="relative h-full overflow-hidden bg-background">
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        locale={locale}
      />
      <main
        id="content"
        className={`overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0 ${isCollapsed ? 'md:ml-14' : 'md:ml-64'} h-full`}
      >
        <AppBar locale={locale}></AppBar>
        <Outlet />
      </main>
    </div>
  )
}
