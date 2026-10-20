export interface MqMarqueeProps {
  text?: string
  /** 滚动一轮的时长（秒）。 */
  duration?: number
  direction?: 'left' | 'right'
  paused?: boolean
}

export interface MqMarqueeEmits {
  (e: 'click'): void
}
