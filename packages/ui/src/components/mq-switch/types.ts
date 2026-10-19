import type { MqOptionValue } from '../../utils/model'

export type MqSwitchShape = 'round' | 'square'

export type MqSwitchBeforeChange = (value: MqOptionValue) => boolean | Promise<boolean>

export interface MqSwitchProps {
  modelValue?: MqOptionValue
  disabled?: boolean
  loading?: boolean
  /** 打开时写入的值。默认 `true`。 */
  activeValue?: MqOptionValue
  /** 关闭时写入的值。默认 `false`。 */
  inactiveValue?: MqOptionValue
  activeColor?: string
  inactiveColor?: string
  activeText?: string
  inactiveText?: string
  /** 高度。数字按 px，宽度按高度推算。 */
  size?: string | number
  shape?: MqSwitchShape
  /** 返回 `false` 或抛错时不切换。 */
  beforeChange?: MqSwitchBeforeChange
}

export interface MqSwitchEmits {
  'update:modelValue': [value: MqOptionValue]
  change: [payload: { value: MqOptionValue }]
}
