<template>
  <view
    v-if="notifyState.visible"
    class="mq-notify"
    :class="[`is-${notifyState.type}`, `is-${notifyState.position}`]"
    :style="rootStyle"
    role="status"
    aria-live="polite"
  >
    <text class="mq-notify__text">{{ notifyState.message }}</text>
    <text v-if="notifyState.closable" class="mq-notify__close" @click.stop="onClose">×</text>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { hideNotify, notifyState } from '../../utils/notify'

defineOptions({
  name: 'mq-notify',
})

const rootStyle = computed(() => {
  const style: Record<string, string> = {}
  if (notifyState.color) {
    style.color = notifyState.color
  }
  if (notifyState.background) {
    style.background = notifyState.background
  }
  return style
})

function onClose() {
  hideNotify()
}
</script>

<style lang="scss">
@import './index.scss';
</style>
