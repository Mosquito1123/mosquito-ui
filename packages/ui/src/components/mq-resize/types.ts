export interface MqResizeSize {
  width: number
  height: number
}

export interface MqResizeProps {
  /** 禁用监听与事件。默认 `false`。 */
  disabled?: boolean
  /** `resize` 事件的节流间隔（毫秒）。默认 `100`。 */
  throttle?: number
  /** 可选 id，用作 `uni.createSelectorQuery` 回退时的选择器。 */
  id?: string
}

export interface MqResizeEmits {
  resize: [size: MqResizeSize]
}

export interface MqResizeExpose {
  /** 立即测量一次；未禁用时发出 `resize`，读不到 DOM 时回退 uni 查询。 */
  measure: () => MqResizeSize | null
}
