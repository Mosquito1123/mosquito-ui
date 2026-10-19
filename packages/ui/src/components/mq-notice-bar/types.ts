export type MqNoticeBarType = 'warning' | 'info' | 'danger'

export interface MqNoticeBarProps {
  text?: string
  /** `info` 使用主色和弱底，主题里没有单独的信息色。 */
  type?: MqNoticeBarType
  closable?: boolean
  /** 为 true 且未换行时，用 CSS 跑马灯滚动。 */
  scrollable?: boolean
  wrapable?: boolean
  color?: string
  background?: string
}

export interface MqNoticeBarEmits {
  click: []
  close: []
}
