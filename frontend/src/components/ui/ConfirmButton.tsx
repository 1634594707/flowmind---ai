import { Button, Modal } from 'antd'
import type { ButtonProps } from 'antd'

type Props = ButtonProps & {
  confirmTitle?: string
  confirmContent?: string
  onConfirm: () => void | Promise<void>
}

const ConfirmButton = ({ confirmTitle = '确认操作', confirmContent = '确定要继续吗？', onConfirm, onClick, ...rest }: Props) => {
  return (
    <Button
      {...rest}
      onClick={(e) => {
        onClick?.(e)
        Modal.confirm({
          title: confirmTitle,
          content: confirmContent,
          onOk: () => onConfirm(),
        })
      }}
    />
  )
}

export default ConfirmButton
