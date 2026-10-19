export type MqInputNumberBeforeChange = (
  value: number,
) => boolean | Promise<boolean | void> | void

export interface MqInputNumberProps {
  modelValue?: number
  min?: number
  max?: number
  step?: number
  /** 小数位数。非法或负数按 0。 */
  precision?: number
  stepStrictly?: boolean
  disabled?: boolean
  disableInput?: boolean
  disableMinus?: boolean
  disablePlus?: boolean
  beforeChange?: MqInputNumberBeforeChange
}

export interface MqInputNumberEmits {
  'update:modelValue': [value: number]
  change: [payload: { value: number }]
}
