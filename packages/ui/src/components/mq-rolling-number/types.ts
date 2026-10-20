export interface MqRollingNumberProps {
  value?: number | string
  /** 小数位，0~6。 */
  decimals?: number
  /** 千分位分隔符，传空字符串关闭。 */
  separator?: string
  prefix?: string
  suffix?: string
  /** 单个数字的高度（px），同时决定字号。 */
  height?: number
  /** 滚动动画时长（ms）。 */
  duration?: number
  /** 数字颜色。 */
  color?: string
  /** 首次挂载时从 0 滚到目标值。 */
  autoplay?: boolean
}

export interface MqRollingNumberEmits {
  (e: 'finish'): void
}

export interface MqRollingNumberExpose {
  /** 立即结束动画并显示目标值。 */
  finish: () => void
}
