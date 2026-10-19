<template>
  <view
    class="mq-progress"
    :class="status ? `is-${status}` : undefined"
    role="progressbar"
    :aria-valuenow="safe"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <view class="mq-progress__track">
      <view class="mq-progress__bar" :style="barStyle" />
    </view>
    <text v-if="!hideText" class="mq-progress__text">{{ safe }}%</text>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { clampPercent } from '../../utils/model'
import type { MqProgressProps } from './types'

defineOptions({
  name: 'mq-progress',
})

const props = withDefaults(defineProps<MqProgressProps>(), {
  percentage: 0,
  hideText: false,
  color: '',
})

const safe = computed(() => clampPercent(props.percentage))

const barStyle = computed(() => {
  const style: Record<string, string> = {
    width: `${safe.value}%`,
  }
  if (props.color) {
    style.background = props.color
  }
  return style
})
</script>

<style lang="scss">
@import './index.scss';
</style>
