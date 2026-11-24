<template>
  <view
    v-if="visible"
    class="mq-video-preview"
    role="dialog"
    aria-modal="true"
    :aria-label="effectiveTitle || '视频预览'"
  >
    <view v-if="effectiveTitle" class="mq-video-preview__title">{{ effectiveTitle }}</view>
    <video
      class="mq-video-preview__video"
      :src="effectiveSrc"
      :poster="effectivePoster"
      :autoplay="autoplay"
      :controls="true"
      @play="onPlay"
      @pause="onPause"
      @ended="onEnd"
    />
    <text
      v-if="showClose"
      class="mq-video-preview__close"
      role="button"
      tabindex="0"
      aria-label="关闭"
      @click="requestClose"
    >
      ×
    </text>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { hideVideoPreview, videoPreviewState } from '../../utils/video-preview'
import type { MqVideoPreviewEmits, MqVideoPreviewProps } from './types'

defineOptions({
  name: 'mq-video-preview',
})

const props = withDefaults(defineProps<MqVideoPreviewProps>(), {
  // 显式保留 undefined，避免 Vue 对 Boolean prop 的自动 false 转换吞掉「未传」状态。
  modelValue: undefined,
  visible: undefined,
  autoplay: false,
  showClose: true,
})

const emit = defineEmits<MqVideoPreviewEmits>()

const usingGlobal = computed(() => props.src === undefined)
const effectiveSrc = computed(() => props.src ?? videoPreviewState.src)
const effectiveTitle = computed(() => props.title ?? videoPreviewState.title)
const effectivePoster = computed(() => props.poster ?? videoPreviewState.poster)
const visible = computed(() => {
  if (props.modelValue !== undefined) {
    return props.modelValue
  }
  if (props.visible !== undefined) {
    return props.visible
  }
  return videoPreviewState.visible
})

function requestClose() {
  emit('update:modelValue', false)
  emit('update:visible', false)
  emit('close')
  if (usingGlobal.value) {
    hideVideoPreview()
  }
}

function onPlay() {
  emit('play')
}

function onPause() {
  emit('pause')
}

function onEnd() {
  emit('end')
}
</script>

<style lang="scss">
@import './index.scss';
</style>
