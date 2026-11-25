<template>
  <view class="mq-status-tip" role="status">
    <view v-if="slots.image" class="mq-status-tip__image">
      <slot name="image" />
    </view>
    <image
      v-else-if="customSrc"
      class="mq-status-tip__image"
      :src="customSrc"
      :mode="imageMode"
      :style="imageStyle"
      aria-hidden="true"
    />
    <view v-else class="mq-status-tip__mark" :style="imageStyle" aria-hidden="true">
      <text class="mq-status-tip__symbol">{{ symbol }}</text>
    </view>

    <text v-if="tip" class="mq-status-tip__tip">{{ tip }}</text>

    <view v-if="slots.bottom || slots.default" class="mq-status-tip__bottom">
      <slot name="bottom" />
      <slot />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import type { MqStatusTipImage, MqStatusTipProps } from './types'

defineOptions({
  name: 'mq-status-tip',
})

const props = withDefaults(defineProps<MqStatusTipProps>(), {
  image: 'network',
  imageSize: undefined,
  tip: '',
  imageMode: 'aspectFit',
  urlPrefix: '',
})

const slots = useSlots()

const symbols: Record<MqStatusTipImage, string> = {
  search: '⌕',
  network: '⌁',
  content: '▤',
  collect: '☆',
  comment: '✎',
  halo: '!',
  message: '✉',
}

const symbol = computed(() => symbols[props.image as MqStatusTipImage] ?? '⌁')

const customSrc = computed(() => {
  if (props.image in symbols) {
    return ''
  }
  const url = `${props.urlPrefix}${props.image}`
  // 空 URL 不作为自定义图片渲染，避免触发原生图片错误。
  return url.trim() ? url : ''
})

const imageStyle = computed(() => {
  const size = props.imageSize
  if (size === undefined || size === null || size === '') {
    return undefined
  }
  if (typeof size === 'number') {
    return { width: `${size}px`, height: `${size}px` }
  }
  if (typeof size === 'string') {
    return { width: size, height: size }
  }
  const style: Record<string, string> = {}
  if (size.width !== undefined) {
    style.width = typeof size.width === 'number' ? `${size.width}px` : size.width
  }
  if (size.height !== undefined) {
    style.height = typeof size.height === 'number' ? `${size.height}px` : size.height
  }
  return style
})
</script>

<style lang="scss">
@import './index.scss';
</style>
