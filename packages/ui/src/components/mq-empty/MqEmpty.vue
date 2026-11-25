<template>
  <view class="mq-empty" role="status">
    <view v-if="slots.image" class="mq-empty__image">
      <slot name="image" />
    </view>
    <image
      v-else-if="isIconUrl"
      class="mq-empty__icon mq-empty__icon--image"
      :src="iconSrc"
      :style="iconStyle"
      mode="aspectFit"
      aria-hidden="true"
    />
    <text v-else-if="iconSrc" class="mq-empty__icon" :style="iconStyle" aria-hidden="true">{{
      iconSrc
    }}</text>
    <view v-else class="mq-empty__mark" aria-hidden="true" />
    <text v-if="tip" class="mq-empty__tip">{{ tip }}</text>
    <view v-if="slots.default" class="mq-empty__bottom">
      <slot />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import type { MqEmptyProps } from './types'

defineOptions({
  name: 'mq-empty',
})

const props = withDefaults(defineProps<MqEmptyProps>(), {
  tip: '',
  icon: '',
  iconSize: undefined,
})

const slots = useSlots()

const iconSrc = computed(() => (typeof props.icon === 'string' ? props.icon.trim() : ''))

const isIconUrl = computed(() => iconSrc.value.startsWith('data:') || iconSrc.value.includes('/'))

const iconStyle = computed(() => {
  const size = props.iconSize
  if (size === undefined || size === null || size === '') {
    return undefined
  }
  if (typeof size === 'number') {
    if (!Number.isFinite(size) || size <= 0) {
      return undefined
    }
    const sizeText = `${size}px`
    return { fontSize: sizeText, width: sizeText, height: sizeText }
  }
  const text = size.trim()
  return text ? { fontSize: text, width: text, height: text } : undefined
})
</script>

<style lang="scss">
@import './index.scss';
</style>
