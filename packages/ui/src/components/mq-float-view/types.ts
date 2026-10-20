export interface MqFloatViewProps {
  /** 初始横坐标（px）。 */
  x?: number
  /** 初始纵坐标（px）。 */
  y?: number
  width?: number
  height?: number
  draggable?: boolean
  zIndex?: number
}

export interface MqFloatViewPosition {
  x: number
  y: number
}

export interface MqFloatViewEmits {
  (e: 'update:x', value: number): void
  (e: 'update:y', value: number): void
  (e: 'move-end', payload: MqFloatViewPosition): void
  (e: 'click'): void
}

export interface MqFloatViewExpose {
  reset: () => void
}
