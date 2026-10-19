export type MqStepStatus = 'finished' | 'process' | 'error' | 'wait'

export interface MqStepProps {
  title?: string
  description?: string
  /** 不传时按父级 active 推导：之前为完成，当前为进行中，之后为等待。 */
  status?: MqStepStatus
}
