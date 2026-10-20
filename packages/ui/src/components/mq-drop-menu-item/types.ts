export interface MqDropMenuItemOption {
  label?: string
  value?: string | number
  tip?: string
  disabled?: boolean
  [key: string]: unknown
}

export interface MqDropMenuItemBeforeToggle {
  (payload: { status: boolean }): boolean | Promise<boolean>
}

export interface MqDropMenuItemProps {
  modelValue?: string | number
  disabled?: boolean
  options?: MqDropMenuItemOption[]
  /** 设置后优先展示标题文案，不再展示选中项。 */
  title?: string
  placeholder?: string
  valueKey?: string
  labelKey?: string
  tipKey?: string
  /** 下拉面板最大高度，默认 `60vh`。 */
  popupHeight?: string
  beforeToggle?: MqDropMenuItemBeforeToggle
}

export interface MqDropMenuItemChangePayload {
  value: string | number
  selectedItem: MqDropMenuItemOption
}

export interface MqDropMenuItemEmits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', payload: MqDropMenuItemChangePayload): void
  (e: 'open'): void
  (e: 'opened'): void
  (e: 'close'): void
  (e: 'closed'): void
}

export interface MqDropMenuItemExpose {
  getShowPop: () => boolean
  open: () => void
  close: () => void
  toggle: () => void
}
