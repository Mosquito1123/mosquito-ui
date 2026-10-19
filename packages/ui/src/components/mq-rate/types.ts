export interface MqRateProps {
  modelValue?: number
  /** 星星个数。非法或小于 1 时按 5。 */
  num?: number
  readonly?: boolean
  disabled?: boolean
  /** 字号，像素。 */
  size?: string | number
  /** 星星间距，像素。 */
  space?: string | number
  /** 未点亮的颜色。 */
  color?: string
  activeColor?: string
  allowHalf?: boolean
  /** 再点一次当前值时回到 0。 */
  clearable?: boolean
}

export interface MqRateEmits {
  'update:modelValue': [value: number]
  change: [payload: { value: number }]
}
