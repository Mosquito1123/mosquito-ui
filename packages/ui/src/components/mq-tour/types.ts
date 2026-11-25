export type MqTourPlacement = 'top' | 'bottom' | 'left' | 'right'

export interface MqTourStep {
  /** 目标元素的 CSS 选择器，用于测量高亮框。 */
  target?: string
  title?: string
  content?: string
  /** 气泡相对高亮框的位置。 */
  placement?: MqTourPlacement
}

export interface MqTourChangePayload {
  index: number
  step: MqTourStep
}

export interface MqTourProps {
  steps?: MqTourStep[]
  /** 显隐，配合 `v-model:visible`。 */
  visible?: boolean
  /** `visible` 的别名，兼容只传 `show` 的用法。 */
  show?: boolean
  /** 当前步骤，配合 `v-model:current`。 */
  current?: number
  nextText?: string
  prevText?: string
  doneText?: string
  /** 是否绘制半透明遮罩。 */
  overlay?: boolean
  maskClosable?: boolean
}

export interface MqTourEmits {
  (e: 'update:visible', value: boolean): void
  (e: 'update:show', value: boolean): void
  (e: 'update:current', value: number): void
  (e: 'change', payload: MqTourChangePayload): void
  (e: 'finish'): void
  (e: 'close'): void
  (e: 'skip'): void
}

export interface MqTourExpose {
  next: () => void
  prev: () => void
  finish: () => void
}
