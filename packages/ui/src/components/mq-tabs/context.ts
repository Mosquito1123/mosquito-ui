import type { ComputedRef, InjectionKey, Ref } from 'vue'

export interface MqTabPane {
  name: string | number
  title: string
  disabled: boolean
}

export interface MqTabsContext {
  active: ComputedRef<string | number | undefined>
  panes: Ref<MqTabPane[]>
  register: (pane: MqTabPane) => number
  unregister: (index: number) => void
  update: (index: number, pane: MqTabPane) => void
  select: (index: number, name: string | number, disabled: boolean) => void
}

export const tabsKey: InjectionKey<MqTabsContext> = Symbol('mq-tabs')
