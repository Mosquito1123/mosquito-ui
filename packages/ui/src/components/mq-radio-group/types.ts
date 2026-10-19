import type { MqOptionValue } from '../../utils/model'
import type { MqRadioType } from '../mq-radio/types'

export interface MqRadioGroupProps {
  modelValue?: MqOptionValue
  type?: MqRadioType
  disabled?: boolean
  readonly?: boolean
  placement?: 'left' | 'right'
  direction?: 'horizontal' | 'vertical'
  /** 再点当前项时清空。 */
  allowUncheck?: boolean
  checkedColor?: string
  uncheckedColor?: string
}

export interface MqRadioGroupEmits {
  'update:modelValue': [value: MqOptionValue | undefined]
  change: [payload: { value: MqOptionValue | undefined }]
}
