<template>
  <view class="mq-marquee" @click="emit('click')">
    <view class="mq-marquee__track" :style="trackStyle">
      <text class="mq-marquee__item">{{ text }}</text>
      <text class="mq-marquee__item" aria-hidden="true">{{ text }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MqMarqueeEmits, MqMarqueeProps } from './types'

defineOptions({
  name: 'mq-marquee',
})

const props = withDefaults(defineProps<MqMarqueeProps>(), {
  text: '',
  duration: 12,
  direction: 'left',
  paused: false,
})

const emit = defineEmits<MqMarqueeEmits>()

const trackStyle = computed(() => {
  const value = Number(props.duration)
  const duration = Number.isFinite(value) && value > 0 ? value : 12
  return {
    animationDuration: `${duration}s`,
    animationDirection: props.direction === 'right' ? 'reverse' : 'normal',
    animationPlayState: props.paused ? 'paused' : 'running',
  }
})
</script>

<style lang="scss">
@import './index.scss';
</style>
