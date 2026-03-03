import { Spin } from 'antd'

type Props = {
  className?: string
  size?: 'small' | 'default' | 'large'
}

const LoadingBlock = ({ className, size = 'default' }: Props) => {
  return (
    <div className={className ? className : 'flex items-center justify-center py-10'}>
      <Spin size={size} />
    </div>
  )
}

export default LoadingBlock
