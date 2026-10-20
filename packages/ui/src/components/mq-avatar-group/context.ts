import type { ComputedRef, InjectionKey, Ref } from 'vue'
import type { MqAvatarShape, MqAvatarSize } from '../mq-avatar/types'

export interface MqAvatarGroupContext {
  size: ComputedRef<MqAvatarSize | undefined>
  shape: ComputedRef<MqAvatarShape | undefined>
  maxCount: ComputedRef<number>
  items: Ref<symbol[]>
  register: (id: symbol) => void
  unregister: (id: symbol) => void
}

export const avatarGroupKey: InjectionKey<MqAvatarGroupContext> = Symbol('mq-avatar-group')
