export type MqNotifyType = 'primary' | 'success' | 'warning' | 'danger'
export type MqNotifyPosition = 'top' | 'bottom'

export interface MqNotifyOptions {
  message: string
  type?: MqNotifyType
  position?: MqNotifyPosition
  /**
   * 显示时长，毫秒。默认 3000。
   * `0` 表示不自动关闭。
   */
  duration?: number
  color?: string
  background?: string
  closable?: boolean
}

export type MqNotifyInput = string | MqNotifyOptions
export type MqNotifyCloser = () => void

export interface MqNotifyState {
  visible: boolean
  message: string
  type: MqNotifyType
  position: MqNotifyPosition
  color: string
  background: string
  closable: boolean
}
