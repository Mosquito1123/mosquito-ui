<template>
  <view class="mq-cell-group" :class="{ 'is-insert': insert, 'has-border': border }">
    <view v-if="title || value" class="mq-cell-group__head">
      <text class="mq-cell-group__title">{{ title }}</text>
      <text v-if="value" class="mq-cell-group__value">{{ value }}</text>
    </view>
    <view class="mq-cell-group__body">
      <slot />
    </view>
  </view>
</template>

<script setup lang="ts">
import type { MqCellGroupProps } from './types'

defineOptions({
  name: 'mq-cell-group',
})

withDefaults(defineProps<MqCellGroupProps>(), {
  title: '',
  value: '',
  border: false,
  insert: false,
})
</script>

<style lang="scss">
@import './index.scss';
</style>
