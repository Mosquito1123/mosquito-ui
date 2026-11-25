<template>
  <view
    class="mq-loading"
    :class="[`mq-loading--${type}`, `mq-loading--${direction}`]"
    role="progressbar"
    aria-busy="true"
    :aria-label="resolvedLabel"
    :style="rootStyle"
  >
    <slot v-if="slots.default" />
    <text v-else-if="text" class="mq-loading__text">{{ text }}</text>
  </view>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { t } from '../../locale'
import type { MqLoadingProps } from './types'

defineOptions({
  name: 'mq-loading',
})

const props = withDefaults(defineProps<MqLoadingProps>(), {
  size: 20,
  type: 'circular',
  text: '',
  direction: 'horizontal',
})

const slots = useSlots()

const resolvedLabel = computed(() => props.label?.trim() || t('common.loading'))

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
