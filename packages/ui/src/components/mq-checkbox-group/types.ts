import type { MqOptionValue } from '../../utils/model'
import type { MqCheckboxType } from '../mq-checkbox/types'

export interface MqCheckboxGroupProps {
  modelValue?: MqOptionValue[]
  type?: MqCheckboxType
  disabled?: boolean
  readonly?: boolean
  /** 至少保留几个。 */
  min?: number
  /** 最多选几个。`0` 表示不限制。 */
  max?: number
  placement?: 'left' | 'right'
  direction?: 'horizontal' | 'vertical'
  checkedColor?: string
  uncheckedColor?: string
}

export interface MqCheckboxGroupEmits {
  'update:modelValue': [value: MqOptionValue[]]
  change: [payload: { value: MqOptionValue[] }]
}
