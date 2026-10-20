<template>
  <view class="mq-drop-menu" :style="rootStyle">
    <view class="mq-drop-menu__bar">
      <slot />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { dropMenuKey } from './context'
import type { MqDropMenuProps } from './types'

defineOptions({
  name: 'mq-drop-menu',
})

const props = withDefaults(defineProps<MqDropMenuProps>(), {
  zIndex: 12,
  direction: 'down',
  modal: true,
  closeOnClickModal: true,
  duration: 200,
})

const activeKey = ref<symbol | null>(null)

const zIndex = computed(() => (Number.isFinite(props.zIndex) ? props.zIndex : 12))
const duration = computed(() => {
  const value = Number(props.duration)
  return Number.isFinite(value) && value >= 0 ? value : 200
})

const rootStyle = computed(() => ({
  zIndex: String(zIndex.value),
}))

function setActive(key: symbol | null) {
  activeKey.value = key
}

function close() {
  activeKey.value = null
}

provide(dropMenuKey, {
  activeKey,
  setActive,
  close,
  direction: computed(() => props.direction),
  zIndex,
  modal: computed(() => props.modal),
  closeOnClickModal: computed(() => props.closeOnClickModal),
  duration,
})

defineExpose({
  close,
})
</script>

<style lang="scss">
@import './index.scss';
</style>
