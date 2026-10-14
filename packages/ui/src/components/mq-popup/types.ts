export type MqPopupPosition = 'bottom' | 'center'

export interface MqPopupProps {
  modelValue?: boolean
  position?: MqPopupPosition
  maskClosable?: boolean
  duration?: number
}
