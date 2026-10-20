export interface MqTimelineItemProps {
  title?: string
  time?: string
  /** 高亮当前节点。 */
  active?: boolean
  /** 节点颜色，默认主题主色。 */
  color?: string
  /** 连接线颜色。 */
  lineColor?: string
  /** 隐藏该节点下方的连接线（最后一项一般由样式自动隐藏）。 */
  hideLine?: boolean
}

export interface MqTimelineItemEmits {
  (e: 'click'): void
}
