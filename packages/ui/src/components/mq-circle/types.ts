export type MqCircleColor = string | Record<string, string>
export type MqCircleLinecap = 'butt' | 'round' | 'square'

export interface MqCircleProps {
  modelValue?: number
  size?: number
  color?: MqCircleColor
  layerColor?: string
  fill?: string
  /** 动画速度，单位 rate/s。0 表示不动画。 */
  speed?: number
  text?: string
  strokeWidth?: number
  strokeLinecap?: MqCircleLinecap
  clockwise?: boolean
}

export interface MqCircleEmits {
  (e: 'update:modelValue', value: number): void
}
