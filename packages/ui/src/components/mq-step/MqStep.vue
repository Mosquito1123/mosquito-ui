<template>
  <view class="mq-step" :class="[`is-${resolved}`, { 'is-dot': dot, 'is-vertical': vertical, 'is-center': alignCenter }]">
    <view class="mq-step__head">
      <text class="mq-step__icon">{{ dot ? '' : index + 1 }}</text>
      <view class="mq-step__line" />
    </view>
    <view class="mq-step__main">
      <text class="mq-step__title">{{ title }}</text>
      <text v-if="description" class="mq-step__desc">{{ description }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { stepsKey } from '../mq-steps/context'
import type { MqStepProps, MqStepStatus } from './types'

defineOptions({
  name: 'mq-step',
})

const props = withDefaults(defineProps<MqStepProps>(), {
  title: '',
  description: '',
})

const group = inject(stepsKey, null)
const index = group ? group.claim() : 0
const dot = computed(() => group?.dot.value ?? false)
const vertical = computed(() => group?.vertical.value ?? false)
const alignCenter = computed(() => group?.alignCenter.value ?? false)

const resolved = computed<MqStepStatus>(() => {
  if (props.status) {
    return props.status
  }
  const active = group?.active.value ?? -1
  if (index < active) {
    return 'finished'
  }
  if (index === active) {
    return 'process'
  }
  return 'wait'
})
</script>

<style lang="scss">
@import './index.scss';
</style>
