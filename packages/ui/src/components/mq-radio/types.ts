import type { MqOptionValue } from '../../utils/model'

export type MqRadioType = 'circle' | 'square' | 'button'

export interface MqRadioProps {
  /** 和单选组的 `v-model` 比对的值。 */
  value?: MqOptionValue
  type?: MqRadioType
  disabled?: boolean
  readonly?: boolean
  placement?: 'left' | 'right'
  checkedColor?: string
  uncheckedColor?: string
}
