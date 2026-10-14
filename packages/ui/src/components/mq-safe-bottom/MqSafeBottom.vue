<template>
  <view class="mq-safe-bottom" :style="rootStyle">
    <slot />
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MqSafeBottomProps } from './types'

defineOptions({
  name: 'mq-safe-bottom',
})

const props = withDefaults(defineProps<MqSafeBottomProps>(), {
  bg: 'transparent',
})

const rootStyle = computed(() => ({
  background: props.bg || 'transparent',
}))
</script>

<style lang="scss">
@import './index.scss';
</style>
