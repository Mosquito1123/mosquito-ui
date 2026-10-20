export interface MqSlideVerifyProps {
  /** 是否已通过验证。 */
  modelValue?: boolean
  text?: string
  successText?: string
  disabled?: boolean
  /** 通过阈值，0~1，默认 0.9。 */
  threshold?: number
  /** 轨道高度，也是滑块直径。 */
  height?: number
}

export interface MqSlideVerifyChangePayload {
  verified: boolean
}

export interface MqSlideVerifyEmits {
  (e: 'update:modelValue', verified: boolean): void
  (e: 'change', payload: MqSlideVerifyChangePayload): void
  (e: 'success'): void
  (e: 'fail'): void
}

export interface MqSlideVerifyExpose {
  reset: () => void
}
