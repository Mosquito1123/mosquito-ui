<template>
  <view
    v-if="visible"
    class="mq-image-preview"
    role="dialog"
    aria-modal="true"
    aria-label="图片预览"
    @click="onMask"
  >
    <view class="mq-image-preview__stage" @click.stop>
      <swiper
        class="mq-image-preview__swiper"
        :current="innerIndex"
        :circular="loop"
        :indicator-dots="false"
        @change="onSwiperChange"
      >
        <swiper-item v-for="(url, i) in effectiveUrls" :key="`${i}-${url}`" class="mq-image-preview__item">
          <image
            class="mq-image-preview__image"
            :class="{ 'is-zoomed': zoomed && i === innerIndex }"
            :src="url"
            mode="aspectFit"
            :style="imageStyle(i)"
            @click="onImageTap"
            @longpress="onLongpress"
          />
        </swiper-item>
      </swiper>
    </view>

    <view v-if="indicator && effectiveUrls.length > 1" class="mq-image-preview__dots">
      <view
        v-for="(url, i) in effectiveUrls"
        :key="`dot-${i}-${url}`"
        class="mq-image-preview__dot"
        :class="{ 'is-active': i === innerIndex }"
      />
    </view>
    <view v-if="showIndex" class="mq-image-preview__index"
      >{{ innerIndex + 1 }} / {{ effectiveUrls.length }}</view
    >

    <text
      class="mq-image-preview__close"
      role="button"
      tabindex="0"
      aria-label="关闭"
      @click.stop="requestClose"
    >
      ×
    </text>
  </view>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { clampImageIndex, hideImagePreview, imagePreviewState } from '../../utils/image-preview'
import type { MqImagePreviewEmits, MqImagePreviewProps } from './types'

defineOptions({
  name: 'mq-image-preview',
})

const props = withDefaults(defineProps<MqImagePreviewProps>(), {
  // 显式保留 undefined，避免 Vue 对 Boolean prop 的自动 false 转换吞掉「未传」状态。
  modelValue: undefined,
  visible: undefined,
  showIndex: false,
  loop: true,
  indicator: true,
  maskClosable: true,
})

const emit = defineEmits<MqImagePreviewEmits>()

const usingGlobal = computed(() => props.urls === undefined)
const effectiveUrls = computed(() => props.urls ?? imagePreviewState.urls)
const visible = computed(() => {
  if (props.modelValue !== undefined) {
    return props.modelValue
  }
  if (props.visible !== undefined) {
    return props.visible
  }
  return imagePreviewState.visible
})

const innerIndex = ref(0)
const zoomed = ref(false)
let lastTap = 0

watch(
  [effectiveUrls, () => props.current, () => imagePreviewState.visible, () => imagePreviewState.index],
  () => {
    const source =
      props.current !== undefined ? props.current : usingGlobal.value ? imagePreviewState.index : 0
    innerIndex.value = clampImageIndex(source, effectiveUrls.value.length)
    zoomed.value = false
  },
  { immediate: true },
)

function requestClose() {
  emit('update:modelValue', false)
  emit('update:visible', false)
  emit('close')
  if (usingGlobal.value) {
    hideImagePreview()
  }
}

function onMask() {
  if (!props.maskClosable) {
    return
  }
  requestClose()
}

function onSwiperChange(event: Event) {
  const detail = (event as Event & { detail?: { current?: number } }).detail
  const index = clampImageIndex(detail?.current, effectiveUrls.value.length)
  if (index === innerIndex.value) {
    return
  }
  innerIndex.value = index
  zoomed.value = false
  emit('change', { index })
  if (usingGlobal.value) {
    imagePreviewState.index = index
  }
}

function imageStyle(index: number): Record<string, string> {
  return { transform: zoomed.value && index === innerIndex.value ? 'scale(2)' : 'scale(1)' }
}

function onImageTap() {
  const now = Date.now()
  if (now - lastTap <= 300) {
    zoomed.value = !zoomed.value
    lastTap = 0
    return
  }
  lastTap = now
}

function onLongpress() {
  emit('longpress', { index: innerIndex.value, url: effectiveUrls.value[innerIndex.value] ?? '' })
}
</script>

<style lang="scss">
@import './index.scss';
</style>
