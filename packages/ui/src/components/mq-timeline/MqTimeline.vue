<template>
  <view class="mq-timeline" :class="{ 'is-reverse': props.reverse }">
    <slot />
  </view>
</template>

<script setup lang="ts">
import type { MqTimelineProps } from './types'

defineOptions({
  name: 'mq-timeline',
})

const props = withDefaults(defineProps<MqTimelineProps>(), {
  reverse: false,
})
</script>

<style lang="scss">
@import './index.scss';
</style>
