<template>
  <view v-if="toastState.visible" class="mq-toast" role="status" aria-live="polite">
    <text class="mq-toast__text">{{ toastState.message }}</text>
  </view>
</template>

<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount } from 'vue'
import { attachToastHost, toastState } from '../../utils/toast'

defineOptions({
  name: 'mq-toast',
})

let detach = () => {}

onBeforeMount(() => {
  detach = attachToastHost()
})

onBeforeUnmount(() => {
  detach()
  detach = () => {}
})
</script>

<style lang="scss">
@import './index.scss';
</style>
