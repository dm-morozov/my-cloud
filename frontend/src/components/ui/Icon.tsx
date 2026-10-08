import type { SVGProps } from 'react'

const paths = {
  cloud: 'M7 18a5 5 0 0 1-1-9.9A6 6 0 0 1 17.8 8a5 5 0 0 1 .2 10H7Z',
  arrow: 'M4 12h16m-6-6 6 6-6 6',
  file: 'M14 3H5v18h14V8l-5-5Zm0 0v5h5M8 13h8m-8 4h5',
  upload: 'M12 16V4m-5 5 5-5 5 5M4 16v4h16v-4',
  edit: 'm4 16 12-12 4 4L8 20H4v-4Z',
  link: 'm10 13 4-4m-7 6-2 2a4 4 0 0 1-5-5l4-4a4 4 0 0 1 5 0m6 1 2-2a4 4 0 0 0-5-5l-4 4a4 4 0 0 0 0 5',
} as const

type IconProps = SVGProps<SVGSVGElement> & { name: keyof typeof paths }

export const Icon = ({ name, ...props }: IconProps) => (
  <svg
    width='20'
    height='20'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='1.5'
    strokeLinecap='round'
    strokeLinejoin='round'
    aria-hidden='true'
    {...props}
  >
    <path d={paths[name]} />
  </svg>
)
