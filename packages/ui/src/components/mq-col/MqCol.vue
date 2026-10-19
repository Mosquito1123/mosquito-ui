<template>
  <view class="mq-col" :style="rootStyle">
    <slot />
  </view>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { rowKey } from '../mq-row/context'
import type { MqColProps } from './types'

defineOptions({
  name: 'mq-col',
})

const props = withDefaults(defineProps<MqColProps>(), {
  span: 24,
  offset: 0,
})

const row = inject(rowKey, null)

const rootStyle = computed(() => {
  const span = Number.isFinite(props.span) ? Math.min(24, Math.max(0, Math.floor(props.span))) : 24
  const offset = Number.isFinite(props.offset) ? Math.min(24, Math.max(0, Math.floor(props.offset))) : 0
  const gutter = row && Number.isFinite(row.gutter.value) && row.gutter.value > 0 ? row.gutter.value : 0
  const style: Record<string, string> = {
    flex: `0 0 ${(span / 24) * 100}%`,
    maxWidth: `${(span / 24) * 100}%`,
  }
  if (offset > 0) {
    style.marginLeft = `${(offset / 24) * 100}%`
  }
  if (gutter) {
    style.paddingLeft = `${gutter / 2}px`
    style.paddingRight = `${gutter / 2}px`
  }
  return style
})
</script>

<style lang="scss">
@import './index.scss';
</style>
