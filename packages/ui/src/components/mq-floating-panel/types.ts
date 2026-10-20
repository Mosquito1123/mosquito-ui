export interface MqFloatingPanelProps {
  /** 当前面板高度，配合 `v-model:height`。 */
  height?: number
  /** 可停靠的锚点高度（px）。默认 `[100, 屏高 * 0.6]`。 */
  anchors?: number[]
  /** 吸附动画时长，`0` 表示关闭动画。 */
  duration?: number
  /** 允许在内容区拖动面板。 */
  contentDraggable?: boolean
  safeArea?: boolean
  showScrollbar?: boolean
}

export interface MqFloatingPanelEmits {
  (e: 'update:height', height: number): void
  (e: 'heightChange', payload: { height: number }): void
}

export interface MqFloatingPanelExpose {
  /** 移动到指定高度，会吸附到最近的锚点。 */
  moveTo: (height: number) => void
}
