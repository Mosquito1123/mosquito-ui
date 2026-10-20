import type { ComputedRef, InjectionKey, Ref } from 'vue'

export type MqDropDirection = 'down' | 'up'

export interface MqDropMenuContext {
  activeKey: Ref<symbol | null>
  setActive: (key: symbol | null) => void
  close: () => void
  direction: ComputedRef<MqDropDirection>
  zIndex: ComputedRef<number>
  modal: ComputedRef<boolean>
  closeOnClickModal: ComputedRef<boolean>
  duration: ComputedRef<number>
}

export const dropMenuKey: InjectionKey<MqDropMenuContext> = Symbol('mq-drop-menu')
