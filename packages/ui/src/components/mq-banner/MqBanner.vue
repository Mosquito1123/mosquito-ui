<template>
  <view class="mq-banner" :style="rootStyle">
    <swiper
      class="mq-banner__swiper"
      :current="innerCurrent"
      :autoplay="autoplay"
      :interval="interval"
      :duration="duration"
      :circular="circular"
      :indicator-dots="false"
      @change="onChange"
    >
      <swiper-item
        v-for="(item, index) in data"
        :key="index"
        class="mq-banner__item"
        @click="onItemClick(item, index)"
      >
        <slot :item="item" :index="index">
          <mq-img
            :src="item.image"
            width="100%"
            height="100%"
            mode="aspectFill"
            :radius="radius"
          />
        </slot>
        <view v-if="showTitle && item.title" class="mq-banner__title">
          <text class="mq-banner__title-text">{{ item.title }}</text>
        </view>
      </swiper-item>
    </swiper>

    <view v-if="indicator && data.length > 1" class="mq-banner__indicator">
      <view
        v-for="(item, index) in data"
        :key="index"
        class="mq-banner__dot"
        :class="{ 'is-active': index === innerCurrent }"
        :style="{ background: index === innerCurrent ? activeIndicatorColor : indicatorColor }"
      />
    </view>

    <view v-if="!data.length" class="mq-banner__empty">
      <slot name="empty">
        <text class="mq-banner__empty-text">暂无数据</text>
      </slot>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import MqImg from '../mq-img/MqImg.vue'
import type { MqBannerEmits, MqBannerItem, MqBannerProps } from './types'

defineOptions({
  name: 'mq-banner',
})

const props = withDefaults(defineProps<MqBannerProps>(), {
  data: () => [],
  modelValue: 0,
  height: 160,
  autoplay: true,
  interval: 3000,
  duration: 300,
  circular: true,
  indicator: true,
  indicatorColor: 'rgba(255, 255, 255, 0.5)',
  activeIndicatorColor: '#ffffff',
  radius: 0,
  showTitle: true,
})

const emit = defineEmits<MqBannerEmits>()

function clamp(index: number): number {
  const total = props.data.length
  if (total <= 0) {
    return 0
  }
  const value = Math.floor(Number(index))
  if (!Number.isFinite(value)) {
    return 0
  }
  return Math.min(total - 1, Math.max(0, value))
}

const innerCurrent = ref(clamp(props.modelValue))

const rootStyle = computed(() => ({
  height: typeof props.height === 'number' ? `${Math.max(0, props.height)}px` : props.height,
  borderRadius: typeof props.radius === 'number' ? `${Math.max(0, props.radius)}px` : props.radius,
}))

watch(
  () => props.modelValue,
  (value) => {
    const next = clamp(value)
    if (next !== innerCurrent.value) {
      innerCurrent.value = next
    }
  },
)

watch(
  () => props.data.length,
  () => {
    const next = clamp(innerCurrent.value)
    if (next !== innerCurrent.value) {
      innerCurrent.value = next
    }
  },
)

function emitChange(index: number) {
  emit('update:modelValue', index)
  emit('change', { index, item: props.data[index] })
}

function onChange(event: Event) {
  const detail = (event as Event & { detail?: { current?: number } }).detail
  const index = clamp(Number(detail?.current))
  if (index === innerCurrent.value) {
    return
  }
  innerCurrent.value = index
  emitChange(index)
}

function onItemClick(item: MqBannerItem, index: number) {
  emit('click', { index, item })
}

function switchTo(index: number) {
  const next = clamp(index)
  if (next === innerCurrent.value) {
    return
  }
  innerCurrent.value = next
  emitChange(next)
}

defineExpose({
  switchTo,
})
</script>

<style lang="scss">
@import './index.scss';
</style>
