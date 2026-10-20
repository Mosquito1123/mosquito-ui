export type MqPopoverPlacement = 'top' | 'bottom' | 'left' | 'right'
export type MqPopoverMode = 'normal' | 'menu'

export interface MqPopoverMenuItem {
  content: string
  /** 文字标记，代替图标字体。 */
  mark?: string
  disabled?: boolean
}

export interface MqPopoverProps {
  modelValue?: boolean
  content?: string | MqPopoverMenuItem[]
  placement?: MqPopoverPlacement
  mode?: MqPopoverMode
  disabled?: boolean
}

export interface MqPopoverEmits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'menuclick', payload: { item: MqPopoverMenuItem; index: number }): void
  (e: 'change', value: boolean): void
  (e: 'open'): void
  (e: 'close'): void
}
