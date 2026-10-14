<template>
  <button
    class="mq-button"
    :class="rootClass"
    :disabled="disabled"
    :hover-class="disabled ? 'none' : 'mq-button--pressed'"
    :hover-stay-time="70"
    @click="onClick"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MqButtonProps } from './types'

defineOptions({
  name: 'mq-button',
})

const props = withDefaults(defineProps<MqButtonProps>(), {
  type: 'default',
  size: 'medium',
  block: false,
  disabled: false,
})

const emit = defineEmits<{
  click: [event: Event]
}>()

const rootClass = computed(() => [
  `mq-button--${props.type}`,
  `mq-button--${props.size}`,
  {
    'mq-button--block': props.block,
    'is-disabled': props.disabled,
  },
])

function onClick(event: Event) {
  if (props.disabled) {
    return
  }
  emit('click', event)
}
</script>

<style lang="scss">
@import './index.scss';
</style>
