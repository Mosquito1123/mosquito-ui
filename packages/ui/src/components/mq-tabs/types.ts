export interface MqTabsProps {
  modelValue?: string | number
  /** 激活文字颜色。 */
  color?: string
  inactiveColor?: string
}

export interface MqTabsEmits {
  'update:modelValue': [value: string | number]
  change: [payload: { index: number; name: string | number }]
  click: [payload: { index: number; name: string | number }]
  disabled: [payload: { index: number; name: string | number }]
}
