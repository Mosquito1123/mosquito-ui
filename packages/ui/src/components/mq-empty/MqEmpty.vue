<template>
  <view class="mq-empty" role="status">
    <view v-if="slots.image" class="mq-empty__image">
      <slot name="image" />
    </view>
    <view v-else class="mq-empty__mark" aria-hidden="true" />
    <text v-if="tip" class="mq-empty__tip">{{ tip }}</text>
    <view v-if="slots.default" class="mq-empty__bottom">
      <slot />
    </view>
  </view>
</template>

<script setup lang="ts">
import { useSlots } from 'vue'
import type { MqEmptyProps } from './types'

defineOptions({
  name: 'mq-empty',
})

withDefaults(defineProps<MqEmptyProps>(), {
  tip: '',
})

const slots = useSlots()
</script>

<style lang="scss">
@import './index.scss';
</style>
