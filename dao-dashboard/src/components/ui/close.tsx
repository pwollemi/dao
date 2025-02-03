import { SVGProps } from '~/i18n/types'
import clsx from 'clsx'
import { FC } from 'react'

const CloseIcon: FC<SVGProps> = ({
  sizeClass = 'h-4 w-4',
  colorClass = 'fill-current stroke-current',
  className,
}) => {
  return (
    <svg
      className={clsx(sizeClass, colorClass, className)}
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M2.47225 23.4722L0.527832 21.5278L10.0556 12L0.527832 2.47225L2.47225 0.527832L12 10.0556L21.5278 0.527832L23.4722 2.47225L13.9445 12L23.4722 21.5278L21.5278 23.4722L12 13.9445L2.47225 23.4722Z" />
    </svg>
  )
}

export default CloseIcon
