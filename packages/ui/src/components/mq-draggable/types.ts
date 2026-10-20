export interface MqDraggableProps<T = unknown> {
  /** 列表数据，拖动结束后通过 `update:modelValue` 回传新顺序。 */
  modelValue?: T[]
  disabled?: boolean
  /** 需要长按后才能开始拖动。 */
  longPress?: boolean
  /** 让位动画时长（ms）。 */
  duration?: number
  /** 开始拖动前的位移阈值（px）。 */
  threshold?: number
}

export interface MqDraggableChangePayload {
  from: number
  to: number
  value: unknown[]
}

export interface MqDraggableEmits<T = unknown> {
  (e: 'update:modelValue', value: T[]): void
  (e: 'change', payload: MqDraggableChangePayload): void
  (e: 'drag-start', payload: { index: number }): void
  (e: 'drag-end', payload: { index: number; to: number }): void
}

export interface MqDraggableExpose {
  measure: () => void
}
