<template>
  <view class="mq-fab" :class="rootClass" :style="rootStyle">
    <view v-if="expandable" class="mq-fab__actions">
      <slot />
    </view>
    <view class="mq-fab__trigger" role="button" :aria-expanded="active ? 'true' : 'false'" @click.stop="onTrigger">
      <slot name="trigger">{{ active ? activeMark : inactiveMark }}</slot>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MqFabEmits, MqFabProps } from './types'

defineOptions({
  name: 'mq-fab',
})

const props = withDefaults(defineProps<MqFabProps>(), {
  active: false,
  type: 'primary',
  position: 'right-bottom',
  direction: 'top',
  disabled: false,
  expandable: true,
  inactiveMark: '+',
  activeMark: '×',
  zIndex: 99,
  gap: 16,
})

const emit = defineEmits<MqFabEmits>()

const rootClass = computed(() => [
  `is-${props.type}`,
  `is-${props.position}`,
  `is-dir-${props.direction}`,
  {
    'is-open': props.active && props.expandable,
    'is-disabled': props.disabled,
  },
])

const rootStyle = computed(() => {
  const style: Record<string, string> = {
    '--mq-fab-gap': `${Number.isFinite(props.gap) ? Math.max(0, props.gap) : 16}px`,
  }
  if (Number.isFinite(props.zIndex)) {
    style.zIndex = String(props.zIndex)
  }
  return style
})

function onTrigger(event: Event) {
  if (props.disabled) {
    return
  }
  emit('click', event)
  if (!props.expandable) {
    return
  }
  const next = !props.active
  emit('update:active', next)
  emit('change', next)
}
</script>

<style lang="scss">
@import './index.scss';
</style>
