<template>
  <view
    v-if="modelValue"
    class="mq-curtain"
    :style="rootStyle"
    @click="onModal"
  >
    <view class="mq-curtain__panel" @click.stop>
      <image
        v-if="src"
        class="mq-curtain__image"
        :src="src"
        :style="imageStyle"
        mode="widthFix"
        @click.stop="onImage"
      />
      <view class="mq-curtain__close" :class="`is-${closePosition}`" @click.stop="onClose">
        <slot name="close">×</slot>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MqCurtainEmits, MqCurtainProps } from './types'

defineOptions({
  name: 'mq-curtain',
})

const props = withDefaults(defineProps<MqCurtainProps>(), {
  modelValue: false,
  src: '',
  width: 280,
  to: '',
  closePosition: 'inset',
  closeOnClickModal: false,
  closeOnClick: true,
  zIndex: 1000,
})

const emit = defineEmits<MqCurtainEmits>()

const rootStyle = computed(() => {
  if (Number.isFinite(props.zIndex)) {
    return { zIndex: String(props.zIndex) }
  }
  return undefined
})

const imageStyle = computed(() => ({
  width: `${Number.isFinite(props.width) && props.width > 0 ? props.width : 280}px`,
}))

function onClose() {
  emit('update:modelValue', false)
  emit('close')
}

function onModal() {
  emit('click-modal')
  if (props.closeOnClickModal) {
    onClose()
  }
}

function onImage() {
  emit('click')
  if (props.to) {
    const uniApi = (globalThis as { uni?: { navigateTo?: (opts: { url: string }) => void } }).uni
    uniApi?.navigateTo?.({ url: props.to })
  }
  if (props.closeOnClick) {
    onClose()
  }
}
</script>

<style lang="scss">
@import './index.scss';
</style>
