<template>
  <view class="mq-safe-bottom" :style="rootStyle">
    <slot />
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MqSafeBottomProps } from './types'

defineOptions({
  name: 'mq-safe-bottom',
})

const props = withDefaults(defineProps<MqSafeBottomProps>(), {
  bg: 'transparent',
})

const resolvedBg = computed(() => {
  const bg = props.bg
  if (typeof bg !== 'string' || bg.trim() === '') {
    return 'transparent'
  }
  return bg.trim()
})

const rootStyle = computed(() => {
  const style: Record<string, string> = {
    backgroundColor: resolvedBg.value,
    '--mq-safe-bg': resolvedBg.value,
  }
  return style
})
</script>

<style lang="scss">
@import './index.scss';
</style>
