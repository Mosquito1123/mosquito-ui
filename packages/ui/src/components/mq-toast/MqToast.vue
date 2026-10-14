<template>
  <view v-if="toastState.visible" class="mq-toast">
    <text class="mq-toast__text">{{ toastState.message }}</text>
  </view>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { attachToastHost, toastState } from '../../utils/toast'

defineOptions({
  name: 'mq-toast',
})

let detach = () => {}

onMounted(() => {
  detach = attachToastHost()
})

onBeforeUnmount(() => {
  detach()
})
</script>

<style lang="scss">
@import './index.scss';
</style>
