<template>
  <view class="mq-collapse">
    <slot />
  </view>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'
import { nextCollapseValue } from '../../utils/model'
import { collapseKey } from './context'
import type { MqCollapseEmits, MqCollapseProps } from './types'

defineOptions({
  name: 'mq-collapse',
})

const props = withDefaults(defineProps<MqCollapseProps>(), {
  modelValue: () => [],
  accordion: false,
  disabled: false,
})

const emit = defineEmits<MqCollapseEmits>()

function isOpen(name: string) {
  if (props.accordion) {
    return props.modelValue === name
  }
  return Array.isArray(props.modelValue) && props.modelValue.includes(name)
}

function toggle(name: string) {
  if (props.disabled || !name) {
    return
  }
  const next = nextCollapseValue(props.modelValue, name, props.accordion)
  emit('update:modelValue', next)
  emit('change', { value: next })
}

provide(collapseKey, {
  disabled: computed(() => props.disabled),
  isOpen,
  toggle,
})
</script>

<style lang="scss">
@import './index.scss';
</style>
