import { SVGProps } from '~/i18n/types'
import clsx from 'clsx'
import { FC } from 'react'

const MenuIcon: FC<SVGProps> = ({
  sizeClass = 'h-4 w-4',
  colorClass = 'fill-current stroke-current',
  className,
}) => {
  return (
    <svg
      className={clsx(sizeClass, colorClass, className)}
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="20"
      viewBox="0 0 30 20"
    >
      <path d="M0 20V17.2222H30V20H0ZM0 11.3889V8.61112H30V11.3889H0ZM0 2.77775V0H30V2.77775H0Z" />
    </svg>
  )
}

export default MenuIcon
