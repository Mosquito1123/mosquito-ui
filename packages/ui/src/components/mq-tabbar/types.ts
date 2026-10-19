export type MqTabbarBeforeChange = (
  value: string | number,
) => boolean | Promise<boolean | void> | void

export interface MqTabbarProps {
  modelValue?: string | number
  fixed?: boolean
  bordered?: boolean
  safeAreaInsetBottom?: boolean
  placeholder?: boolean
  activeColor?: string
  inactiveColor?: string
  beforeChange?: MqTabbarBeforeChange
  zIndex?: number
}

export interface MqTabbarEmits {
  'update:modelValue': [value: string | number]
  change: [payload: { value: string | number }]
}
