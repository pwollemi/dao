'use client'

import Link from 'next/link'
import { FC } from 'react'

interface PIPBarProps {
  url: string
  dict: any
}
const PIPBar: FC<PIPBarProps> = ({ url, dict }) => {
  const pipBar = dict?.pipBar ?? {}

  return (
    <div>
      <Link href={`${url}/`} className="text-center">
        <h2 className="text-3xl text-light_green">{pipBar.title ?? ''}</h2>
      </Link>
      <div className="flex flex-row gap-4 text-xl justify-center my-4 text-light_green">
        <Link href={`${url}/all`}> {pipBar.all ?? ''}</Link>
        <Link href={`${url}/core`}> {pipBar.core ?? ''}</Link>
        <Link href={`${url}/networking`}> {pipBar.networking ?? ''}</Link>
        <Link href={`${url}/interface`}> {pipBar.interface ?? ''}</Link>
        <Link href={`${url}/prc`}> {pipBar.prc ?? ''}</Link>
        <Link href={`${url}/meta`}> {pipBar.meta ?? ''}</Link>
        <Link href={`${url}/informational`}> {pipBar.info ?? ''}</Link>
      </div>
    </div>
  )
}

export default PIPBar
