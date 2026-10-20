export type { MqDropDirection } from './context'

export interface MqDropMenuProps {
  /** 弹层层级。 */
  zIndex?: number
  direction?: 'down' | 'up'
  /** 是否显示蒙层。 */
  modal?: boolean
  closeOnClickModal?: boolean
  /** 展开 / 收起动画时长。 */
  duration?: number
}

export interface MqDropMenuExpose {
  close: () => void
}
