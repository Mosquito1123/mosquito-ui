<template>
  <view class="mq-sidebar" role="tablist">
    <slot />
  </view>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'
import { sidebarKey } from './context'
import type { MqSidebarEmits, MqSidebarProps } from './types'

defineOptions({
  name: 'mq-sidebar',
})

const props = withDefaults(defineProps<MqSidebarProps>(), {
  modelValue: 0,
})

const emit = defineEmits<MqSidebarEmits>()

async function select(value: string | number, label: string, disabled: boolean) {
  if (disabled || value === props.modelValue) {
    return
  }
  if (props.beforeChange) {
    try {
      const ok = await props.beforeChange(value)
      if (ok === false) {
        return
      }
    } catch {
      return
    }
  }
  emit('update:modelValue', value)
  emit('change', { value, label })
}

provide(sidebarKey, {
  active: computed(() => props.modelValue),
  select,
  beforeChange: props.beforeChange,
})
</script>

<style lang="scss">
@import './index.scss';
</style>
