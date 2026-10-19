<template>
  <view class="mq-sticky" :style="rootStyle">
    <slot />
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MqStickyProps } from './types'

defineOptions({
  name: 'mq-sticky',
})

const props = withDefaults(defineProps<MqStickyProps>(), {
  offsetTop: 0,
  zIndex: 1,
})

const rootStyle = computed(() => {
  const top = Number.isFinite(props.offsetTop) ? Math.max(0, props.offsetTop) : 0
  const z = Number.isFinite(props.zIndex) ? props.zIndex : 1
  return {
    top: `${top}px`,
    zIndex: String(z),
  }
})
</script>

<style lang="scss">
@import './index.scss';
</style>
