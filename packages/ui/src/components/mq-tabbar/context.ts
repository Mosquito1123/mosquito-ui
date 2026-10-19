import type { ComputedRef, InjectionKey } from 'vue'

export interface MqTabbarContext {
  active: ComputedRef<string | number | undefined>
  activeColor: ComputedRef<string>
  inactiveColor: ComputedRef<string>
  claim: () => number
  select: (value: string | number) => void
}

export const tabbarKey: InjectionKey<MqTabbarContext> = Symbol('mq-tabbar')
