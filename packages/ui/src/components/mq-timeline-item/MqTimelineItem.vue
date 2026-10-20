<template>
  <view class="mq-timeline-item" :class="{ 'is-active': active }" @click="emit('click')">
    <view class="mq-timeline-item__rail">
      <view class="mq-timeline-item__dot" :style="dotStyle" />
      <view v-if="!hideLine" class="mq-timeline-item__line" :style="lineStyle" />
    </view>
    <view class="mq-timeline-item__body">
      <view v-if="title || time" class="mq-timeline-item__head">
        <text class="mq-timeline-item__title">{{ title }}</text>
        <text v-if="time" class="mq-timeline-item__time">{{ time }}</text>
      </view>
      <view class="mq-timeline-item__content">
        <slot />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MqTimelineItemEmits, MqTimelineItemProps } from './types'

defineOptions({
  name: 'mq-timeline-item',
})

const props = withDefaults(defineProps<MqTimelineItemProps>(), {
  title: '',
  time: '',
  active: false,
  color: '',
  lineColor: '',
  hideLine: false,
})

const emit = defineEmits<MqTimelineItemEmits>()

const dotStyle = computed(() => {
  if (props.color) {
    return { background: props.color }
  }
  return undefined
})

const lineStyle = computed(() => {
  if (props.lineColor) {
    return { background: props.lineColor }
  }
  return undefined
})
</script>

<style lang="scss">
@import './index.scss';
</style>
