<template>
  <button
    class="mq-button"
    :class="rootClass"
    :disabled="inactive"
    :aria-disabled="inactive ? 'true' : undefined"
    :aria-busy="loading ? 'true' : undefined"
    :hover-class="inactive ? 'none' : 'mq-button--pressed'"
    :hover-stay-time="70"
    @click="onClick"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MqButtonEmits, MqButtonProps } from './types'

defineOptions({
  name: 'mq-button',
})

const props = withDefaults(defineProps<MqButtonProps>(), {
  type: 'default',
  variant: 'base',
  size: 'medium',
  round: false,
  block: false,
  disabled: false,
  loading: false,
})

const emit = defineEmits<MqButtonEmits>()

const inactive = computed(() => props.disabled || props.loading)

const rootClass = computed(() => [
  `mq-button--${props.type}`,
  `mq-button--${props.variant}`,
  `mq-button--${props.size}`,
  {
    'mq-button--block': props.block,
    'mq-button--round': props.round,
    'is-disabled': props.disabled,
    'is-loading': props.loading,
  },
])

function onClick(event: Event) {
  if (inactive.value) {
    return
  }
  emit('click', event)
}
</script>

<style lang="scss">
@import './index.scss';
</style>
