export type MqSwipeActionStatus = 'left' | 'close' | 'right'
export type MqSwipeActionReason = 'click' | 'swipe' | 'value'
export type MqSwipeActionPosition = 'left' | 'right' | 'inside'

export type MqSwipeActionBeforeClose = (
  reason: MqSwipeActionReason,
  position: MqSwipeActionPosition,
) => boolean | Promise<boolean | void> | void

export interface MqSwipeActionProps {
  modelValue?: MqSwipeActionStatus
  disabled?: boolean
  beforeClose?: MqSwipeActionBeforeClose
  /** 左侧操作区宽度。未传时按内容估算，默认 76。 */
  leftWidth?: number
  /** 右侧操作区宽度。未传时按内容估算，默认 76。 */
  rightWidth?: number
}

export interface MqSwipeActionEmits {
  (e: 'update:modelValue', value: MqSwipeActionStatus): void
  (e: 'click', position: MqSwipeActionPosition): void
}
