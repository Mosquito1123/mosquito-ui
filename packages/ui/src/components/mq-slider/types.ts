export interface MqSliderProps {
  modelValue?: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  /** 在滑块两侧显示最小值和最大值。 */
  showExtremeValue?: boolean
  activeColor?: string
  inactiveColor?: string
}

export interface MqSliderPayload {
  value: number
}

export interface MqSliderEmits {
  'update:modelValue': [value: number]
  change: [payload: MqSliderPayload]
  dragstart: [payload: MqSliderPayload]
  dragmove: [payload: MqSliderPayload]
  dragend: [payload: MqSliderPayload]
}
