export type MqProgressStatus = 'success' | 'warning' | 'danger'

export interface MqProgressProps {
  /** 0 到 100。越界会被夹住。 */
  percentage?: number
  hideText?: boolean
  color?: string
  status?: MqProgressStatus
}
