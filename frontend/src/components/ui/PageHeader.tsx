import type { ReactNode } from 'react'

type Props = {
  title: string
  subtitle?: string
  right?: ReactNode
}

const PageHeader = ({ title, subtitle, right }: Props) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {subtitle ? <p className="text-gray-600 mt-1">{subtitle}</p> : null}
      </div>
      {right ? <div className="flex items-center gap-3">{right}</div> : null}
    </div>
  )
}

export default PageHeader
