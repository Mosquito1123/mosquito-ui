import type { InjectionKey, Ref } from 'vue'

export interface MqRowContext {
  gutter: Ref<number>
}

export const rowKey: InjectionKey<MqRowContext> = Symbol('mq-row')
