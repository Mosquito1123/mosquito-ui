export type MqLoadmoreState = 'loading' | 'finished' | 'error'

export interface MqLoadmoreProps {
  state?: MqLoadmoreState
  loadingText?: string
  finishedText?: string
  errorText?: string
}

export interface MqLoadmoreEmits {
  (e: 'reload'): void
}
