<template>
  <view class="mq-card" :class="{ 'is-rectangle': type === 'rectangle' }">
    <view v-if="slots.title || title" class="mq-card__title">
      <slot name="title">{{ title }}</slot>
    </view>
    <view class="mq-card__body">
      <slot />
    </view>
    <view v-if="slots.footer" class="mq-card__footer">
      <slot name="footer" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { useSlots } from 'vue'
import type { MqCardProps } from './types'

defineOptions({
  name: 'mq-card',
})

withDefaults(defineProps<MqCardProps>(), {
  title: '',
  type: '',
})

const slots = useSlots()
</script>

<style lang="scss">
@import './index.scss';
</style>
