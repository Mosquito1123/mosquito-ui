export type MqTransitionName =
  | 'fade'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'zoom-in'
  | 'zoom-out'

export interface MqTransitionProps {
  show?: boolean
  name?: MqTransitionName
  duration?: number
}

export interface MqTransitionEmits {
  (e: 'after-enter'): void
  (e: 'after-leave'): void
}
