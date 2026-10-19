export type MqSegmentedOption =
  | string
  | number
  | {
      value: string | number
      disabled?: boolean
      label?: string
    }

export type MqSegmentedTheme = 'card' | 'outline'

export interface MqSegmentedProps {
  modelValue?: string | number
  options?: MqSegmentedOption[]
  disabled?: boolean
  theme?: MqSegmentedTheme
}

export interface MqSegmentedItem {
  value: string | number
  label: string
  disabled: boolean
}

export interface MqSegmentedEmits {
  'update:modelValue': [value: string | number]
  change: [payload: { value: string | number }]
}
