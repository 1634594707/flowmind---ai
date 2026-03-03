type Props = {
  title?: string
  description?: string
  className?: string
}

const EmptyState = ({ title = '暂无数据', description, className }: Props) => {
  return (
    <div className={className ? className : 'py-10 text-center'}>
      <div className="text-gray-900 font-medium">{title}</div>
      {description ? <div className="text-gray-500 text-sm mt-1">{description}</div> : null}
    </div>
  )
}

export default EmptyState
