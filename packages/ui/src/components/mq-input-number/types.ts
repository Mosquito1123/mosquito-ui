export type MqInputNumberBeforeChange = (value: number) => boolean | Promise<boolean | void> | void

export interface MqInputNumberProps {
  /** 绑定值；`allowNull` 为 true 时允许空字符串。 */
  modelValue?: number | ''
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
  /** 隐藏输入框，只保留加减按钮。 */
  withoutInput?: boolean
  /** 允许空值：输入框清空时提交空字符串而不是回退到数字。 */
  allowNull?: boolean
  /** 为 false 时输入过程不提交，只在失焦或点击加减按钮时提交。 */
  immediateChange?: boolean
  /** 输入框宽度，数字按 px 处理。 */
  inputWidth?: string | number
  placeholder?: string
}

export interface MqInputNumberEmits {
  'update:modelValue': [value: number | string]
  change: [payload: { value: number | string }]
  focus: [payload: { value: number | string }]
  blur: [payload: { value: number | string }]
}
