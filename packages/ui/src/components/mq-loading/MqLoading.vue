<template>
  <view class="mq-loading" :style="rootStyle" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MqLoadingProps } from './types'

defineOptions({
  name: 'mq-loading',
})

const props = withDefaults(defineProps<MqLoadingProps>(), {
  size: 20,
})

const rootStyle = computed(() => {
  const size = typeof props.size === 'number' ? `${props.size}px` : props.size
  const style: Record<string, string> = {
    width: size,
    height: size,
  }
  if (props.color) {
    style.borderTopColor = props.color
  }
  return style
})
</script>

<style lang="scss">
@import './index.scss';
</style>
