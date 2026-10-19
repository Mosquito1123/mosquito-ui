<template>
  <view v-if="!loading" class="mq-skeleton mq-skeleton--content">
    <slot />
  </view>
  <view v-else class="mq-skeleton" :class="[`is-${theme}`, animation ? `is-${animation}` : undefined]">
    <view v-if="theme === 'avatar'" class="mq-skeleton__avatar" />
    <view v-else-if="theme === 'image'" class="mq-skeleton__image" />
    <view v-else class="mq-skeleton__lines">
      <view v-for="row in lineCount" :key="row" class="mq-skeleton__line" :style="lineStyle(row)" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MqSkeletonProps } from './types'

defineOptions({
  name: 'mq-skeleton',
})

const props = withDefaults(defineProps<MqSkeletonProps>(), {
  theme: 'text',
  loading: true,
  animation: '',
  rows: 3,
})

const lineCount = computed(() => {
  if (props.theme === 'text') {
    return 1
  }
  if (!Number.isFinite(props.rows) || props.rows < 1) {
    return 3
  }
  return Math.floor(props.rows)
})

function lineStyle(row: number) {
  if (props.theme === 'text') {
    return { width: '60%' }
  }
  if (row === lineCount.value) {
    return { width: '40%' }
  }
  return { width: '100%' }
}
</script>

<style lang="scss">
@import './index.scss';
</style>
