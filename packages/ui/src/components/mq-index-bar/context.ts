import type { InjectionKey, Ref } from 'vue'

export interface MqIndexBarContext {
  sticky: Ref<boolean>
  indexes: Ref<Array<string | number>>
  active: Ref<string | number | undefined>
  register: (index: string | number) => void
  unregister: (index: string | number) => void
  select: (index: string | number) => void
}

export const indexBarKey: InjectionKey<MqIndexBarContext> = Symbol('mq-index-bar')
