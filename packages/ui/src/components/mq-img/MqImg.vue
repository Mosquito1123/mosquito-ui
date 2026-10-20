<template>
  <view class="mq-img" :class="{ 'is-round': round, 'is-failed': failed }" :style="rootStyle" @click="onClick">
    <slot v-if="slots.default" />
    <template v-else>
      <image
        v-if="!failed"
        class="mq-img__inner"
        :src="src"
        :mode="mode"
        :lazy-load="lazyLoad"
        @load="onLoad"
        @error="onError"
      />
      <view v-if="loading && showLoading" class="mq-img__mask">
        <slot name="loading">
          <mq-loading :size="20" />
        </slot>
      </view>
      <view v-else-if="failed" class="mq-img__mask is-error">
        <slot name="error">
          <text class="mq-img__alt">{{ alt || '暂无图片' }}</text>
        </slot>
      </view>
    </template>
  </view>
</template>

<script setup lang="ts">
import { computed, ref, useSlots, watch } from 'vue'
import MqLoading from '../mq-loading/MqLoading.vue'
import type { MqImgEmits, MqImgProps } from './types'

defineOptions({
  name: 'mq-img',
})

const props = withDefaults(defineProps<MqImgProps>(), {
  src: '',
  width: '100%',
  height: 180,
  mode: 'aspectFill',
  radius: '',
  round: false,
  lazyLoad: false,
  showLoading: true,
  alt: '',
})

const emit = defineEmits<MqImgEmits>()
const slots = useSlots()

const failed = ref(!props.src)
const loading = ref(Boolean(props.src))

watch(
  () => props.src,
  (src) => {
    failed.value = !src
    loading.value = Boolean(src)
  },
)

function dimension(value: string | number | undefined, fallback: string): string {
  if (value === undefined || value === '') {
    return fallback
  }
  return typeof value === 'number' ? `${value}px` : value
}

const rootStyle = computed(() => {
  const style: Record<string, string> = {
    width: dimension(props.width, '100%'),
    height: dimension(props.height, '180px'),
  }
  if (props.round) {
    style.borderRadius = '999px'
  } else if (props.radius !== '' && props.radius !== undefined) {
    style.borderRadius = dimension(props.radius, '0')
  }
  return style
})

function onClick(event: Event) {
  emit('click', event)
}

function onLoad(event: Event) {
  loading.value = false
  failed.value = false
  emit('load', event)
}

function onError(event: Event) {
  loading.value = false
  failed.value = true
  emit('error', event)
}
</script>

<style lang="scss">
@import './index.scss';
</style>
