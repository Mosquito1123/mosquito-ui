import type { ComputedRef, InjectionKey } from 'vue'

export interface MqStepsContext {
  active: ComputedRef<number>
  vertical: ComputedRef<boolean>
  dot: ComputedRef<boolean>
  alignCenter: ComputedRef<boolean>
  claim: () => number
}

export const stepsKey: InjectionKey<MqStepsContext> = Symbol('mq-steps')
