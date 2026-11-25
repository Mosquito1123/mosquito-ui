import type { MqOptionValue } from '../../utils/model'

export type MqCheckboxType = 'circle' | 'square' | 'button' | 'dot'

export interface MqCheckboxProps {
  /** 单独使用时的绑定值。在组里改用 `name`。 */
  modelValue?: MqOptionValue
  /** 组内的选项值。 */
  name?: MqOptionValue
  type?: MqCheckboxType
  disabled?: boolean
  readonly?: boolean
  trueValue?: MqOptionValue
  falseValue?: MqOptionValue
  placement?: 'left' | 'right'
  checkedColor?: string
  uncheckedColor?: string
  /** 半选状态，样式优先级高于选中态。 */
  indeterminate?: boolean
}

export interface MqCheckboxEmits {
  'update:modelValue': [value: MqOptionValue]
  change: [payload: { value: MqOptionValue }]
}
