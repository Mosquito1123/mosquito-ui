export type MqCurtainClosePosition =
  | 'inset'
  | 'top'
  | 'bottom'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'

export interface MqCurtainProps {
  modelValue?: boolean
  src?: string
  width?: number
  to?: string
  closePosition?: MqCurtainClosePosition
  closeOnClickModal?: boolean
  closeOnClick?: boolean
  zIndex?: number
}

export interface MqCurtainEmits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'click'): void
  (e: 'close'): void
  (e: 'click-modal'): void
}
