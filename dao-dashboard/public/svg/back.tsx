import { SVGProps } from '~/i18n/types'
import clsx from 'clsx'
import { FC } from 'react'

const BackIcon: FC<SVGProps> = ({
  sizeClass = 'h-5 w-6',
  colorClass = 'fill-current stroke-current',
  className,
}) => {
  return (
    <svg
      className={clsx(sizeClass, colorClass, className)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 404.258 404.258"
    >
      <polygon points="289.927,18 265.927,0 114.331,202.129 265.927,404.258 289.927,386.258 151.831,202.129 " />{' '}
    </svg>
  )
}

export default BackIcon
