import type { ComputedRef, InjectionKey } from 'vue'
import type { MqSidebarBeforeChange } from './types'

export interface MqSidebarContext {
  active: ComputedRef<string | number | undefined>
  select: (value: string | number, label: string, disabled: boolean) => void | Promise<void>
  beforeChange?: MqSidebarBeforeChange
}

export const sidebarKey: InjectionKey<MqSidebarContext> = Symbol('mq-sidebar')
