import type { ComputedRef, InjectionKey } from 'vue'

export interface MqCollapseContext {
  disabled: ComputedRef<boolean>
  isOpen: (name: string) => boolean
  toggle: (name: string) => void
}

export const collapseKey: InjectionKey<MqCollapseContext> = Symbol('mq-collapse')
