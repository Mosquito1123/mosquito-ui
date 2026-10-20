<template>
  <view
    class="mq-avatar-group"
    :class="[`is-${cascading}`, { 'is-vertical': vertical }]"
  >
    <slot />
    <view
      v-if="showCollapse"
      class="mq-avatar-group__collapse"
      :class="{ 'is-square': shape === 'square' }"
      :style="collapseStyle"
      :aria-label="`还有 ${collapsedCount} 个头像`"
    >
      <slot name="collapse">{{ collapseLabel }}</slot>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { resolveAvatarSize } from '../../utils/model'
import { avatarGroupKey } from './context'
import type { MqAvatarGroupProps } from './types'

defineOptions({
  name: 'mq-avatar-group',
})

const props = withDefaults(defineProps<MqAvatarGroupProps>(), {
  maxCount: 0,
  total: 0,
  cascading: 'left-up',
  shape: 'round',
  size: undefined,
  vertical: false,
  collapseText: '',
  collapseBg: '',
  collapseColor: '',
})

const items = ref<symbol[]>([])

const count = computed(() => items.value.length)
const displayCount = computed(() => Math.max(count.value, props.total > 0 ? props.total : 0))
const limit = computed(() => (props.maxCount > 0 ? props.maxCount : displayCount.value))
const collapsedCount = computed(() => Math.max(0, displayCount.value - limit.value))
const showCollapse = computed(() => collapsedCount.value > 0)
const collapseLabel = computed(() => props.collapseText || `+${collapsedCount.value}`)
const sizePx = computed(() => resolveAvatarSize(props.size, 40))

const collapseStyle = computed(() => {
  const size = sizePx.value
  const style: Record<string, string> = {
    width: `${size}px`,
    height: `${size}px`,
    fontSize: `${Math.max(11, Math.round(size * 0.32))}px`,
  }
  if (props.collapseBg) {
    style['--mq-avatar-bg'] = props.collapseBg
  }
  if (props.collapseColor) {
    style['--mq-avatar-ink'] = props.collapseColor
  }
  return style
})

function register(id: symbol) {
  items.value = [...items.value, id]
}

function unregister(id: symbol) {
  items.value = items.value.filter((item) => item !== id)
}

provide(avatarGroupKey, {
  size: computed(() => props.size),
  shape: computed(() => props.shape),
  maxCount: computed(() => props.maxCount),
  items,
  register,
  unregister,
})
</script>

<style lang="scss">
@import './index.scss';
</style>
