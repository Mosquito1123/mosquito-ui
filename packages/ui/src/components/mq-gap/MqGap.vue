<template>
  <view class="mq-gap" :class="{ 'is-safe': safeAreaBottom }" :style="rootStyle" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MqGapProps } from './types'

defineOptions({
  name: 'mq-gap',
})

const props = withDefaults(defineProps<MqGapProps>(), {
  height: 14,
  bg: 'transparent',
  safeAreaBottom: false,
})

const rootStyle = computed(() => {
  const height =
    typeof props.height === 'number' && Number.isFinite(props.height)
      ? `${Math.max(0, props.height)}px`
      : String(props.height || '14px')
  const bg = typeof props.bg === 'string' && props.bg.trim() ? props.bg.trim() : 'transparent'
  return {
    height,
    backgroundColor: bg,
  }
})
</script>

<style lang="scss">
@import './index.scss';
</style>
