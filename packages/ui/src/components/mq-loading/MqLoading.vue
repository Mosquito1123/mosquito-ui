<template>
  <view
    class="mq-loading"
    role="progressbar"
    aria-busy="true"
    :aria-label="resolvedLabel"
    :style="rootStyle"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MqLoadingProps } from './types'

defineOptions({
  name: 'mq-loading',
})

const props = withDefaults(defineProps<MqLoadingProps>(), {
  size: 20,
  label: '加载中',
})

const resolvedLabel = computed(() => props.label.trim() || '加载中')

const rootStyle = computed(() => {
  const style: Record<string, string> = {
    width: normalizeSize(props.size),
    height: normalizeSize(props.size),
  }
  if (typeof props.color === 'string' && props.color.trim()) {
    style.borderTopColor = props.color.trim()
  }
  return style
})

function normalizeSize(size: string | number): string {
  if (typeof size === 'number') {
    if (!Number.isFinite(size) || size <= 0) {
      return '20px'
    }
    return `${size}px`
  }
  const text = size.trim()
  return text || '20px'
}
</script>

<style lang="scss">
@import './index.scss';
</style>
