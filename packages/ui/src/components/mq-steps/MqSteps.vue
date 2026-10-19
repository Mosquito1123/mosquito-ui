<template>
  <view class="mq-steps" :class="{ 'is-vertical': vertical, 'is-center': alignCenter, 'is-dot': dot }">
    <slot />
  </view>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'
import { stepsKey } from './context'
import type { MqStepsProps } from './types'

defineOptions({
  name: 'mq-steps',
})

const props = withDefaults(defineProps<MqStepsProps>(), {
  active: 0,
  vertical: false,
  dot: false,
  alignCenter: false,
})

let serial = 0

provide(stepsKey, {
  active: computed(() => (Number.isFinite(props.active) ? props.active : 0)),
  vertical: computed(() => props.vertical),
  dot: computed(() => props.dot),
  alignCenter: computed(() => props.alignCenter),
  claim: () => serial++,
})
</script>

<style lang="scss">
@import './index.scss';
</style>
