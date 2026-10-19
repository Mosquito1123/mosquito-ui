import type { MqTimeData } from '../../utils/model'

export interface MqCountdownProps {
  /** 倒计时总时长，毫秒。 */
  time?: number
  format?: string
  autoStart?: boolean
  millisecond?: boolean
}

export interface MqCountdownEmits {
  change: [current: MqTimeData]
  finish: []
}

export type { MqTimeData }
