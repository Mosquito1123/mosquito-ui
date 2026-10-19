export type MqCountToType = 'default' | 'primary' | 'success' | 'warning' | 'error'

export interface MqCountToProps {
  color?: string
  type?: MqCountToType
  startVal?: number
  endVal?: number
  duration?: number
  autoStart?: boolean
  decimals?: number
  decimal?: string
  separator?: string
  prefix?: string
  suffix?: string
  useEasing?: boolean
}

export interface MqCountToEmits {
  (e: 'mounted'): void
  (e: 'finish'): void
}
