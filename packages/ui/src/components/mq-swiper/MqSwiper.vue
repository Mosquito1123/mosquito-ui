<template>
  <view class="mq-swiper" :style="rootStyle">
    <swiper
      class="mq-swiper__swiper"
      :current="innerCurrent"
      :autoplay="autoplay"
      :interval="interval"
      :duration="duration"
      :circular="circular"
      :vertical="vertical"
      :previous-margin="marginStyle(previousMargin)"
      :next-margin="marginStyle(nextMargin)"
      :indicator-dots="false"
      @change="onChange"
      @transition="onTransition"
    >
      <swiper-item
        v-for="(item, index) in normalizedList"
        :key="index"
        class="mq-swiper__item"
        @click="onItemClick(index)"
      >
        <slot :item="item" :index="index">
          <image v-if="item.url" class="mq-swiper__image" :src="item.url" mode="aspectFill" />
          <view v-if="item.title" class="mq-swiper__title">
            <text class="mq-swiper__title-text">{{ item.title }}</text>
          </view>
        </slot>
      </swiper-item>
    </swiper>

    <view v-if="indicator && normalizedList.length > 1" class="mq-swiper__indicator">
      <view
        v-for="(item, index) in normalizedList"
        :key="index"
        class="mq-swiper__dot"
        :class="{ 'is-active': index === innerCurrent }"
        :style="{ background: index === innerCurrent ? indicatorActiveColor : indicatorColor }"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type {
  MqSwiperChangePayload,
  MqSwiperEmits,
  MqSwiperItem,
  MqSwiperListItem,
  MqSwiperProps,
  MqSwiperTransitionPayload,
} from './types'

defineOptions({
  name: 'mq-swiper',
})

const props = withDefaults(defineProps<MqSwiperProps>(), {
  list: () => [],
  modelValue: 0,
  autoplay: false,
  interval: 3000,
  duration: 300,
  circular: false,
  vertical: false,
  indicator: true,
  indicatorColor: 'rgba(255, 255, 255, 0.5)',
  indicatorActiveColor: '#ffffff',
  height: 160,
  previousMargin: undefined,
  nextMargin: undefined,
})

const emit = defineEmits<MqSwiperEmits>()

function clamp(index: number): number {
  const total = props.list.length
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

const normalizedList = computed<MqSwiperItem[]>(() =>
  props.list.map((item: MqSwiperListItem) => (typeof item === 'string' ? { url: item, title: '' } : item)),
)

function px(value: number | string | undefined): string {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return `${Math.max(0, value)}px`
  }
  if (typeof value === 'string' && value.trim()) {
    return value.trim()
  }
  return '0px'
}

const rootStyle = computed(() => ({
  height: px(props.height),
}))

const marginStyle = px

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
  () => props.list.length,
  () => {
    const next = clamp(innerCurrent.value)
    if (next !== innerCurrent.value) {
      innerCurrent.value = next
    }
  },
)

function emitChange(index: number) {
  emit('update:modelValue', index)
  const payload: MqSwiperChangePayload = { index, item: props.list[index] }
  emit('change', payload)
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

function onItemClick(index: number) {
  emit('click', { index, item: props.list[index] })
}

function onTransition(event: Event) {
  const detail = (event as Event & { detail?: { dx?: number; dy?: number } }).detail
  const payload: MqSwiperTransitionPayload = {
    dx: Number(detail?.dx) || 0,
    dy: Number(detail?.dy) || 0,
  }
  emit('transition', payload)
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
