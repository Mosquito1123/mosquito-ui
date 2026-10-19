import type { InjectionKey, Ref } from 'vue'
import type { MqGridDirection } from './types'

export interface MqGridContext {
  column: Ref<number>
  border: Ref<boolean>
  gutter: Ref<number>
  square: Ref<boolean>
  clickable: Ref<boolean>
  center: Ref<boolean>
  direction: Ref<MqGridDirection>
}

export const gridKey: InjectionKey<MqGridContext> = Symbol('mq-grid')
