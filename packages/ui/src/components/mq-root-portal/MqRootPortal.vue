<template>
  <Teleport v-if="enabled" :to="target">
    <slot />
  </Teleport>
  <view v-else class="mq-root-portal">
    <slot />
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MqRootPortalProps } from './types'

defineOptions({
  name: 'mq-root-portal',
})

const props = withDefaults(defineProps<MqRootPortalProps>(), {
  to: 'body',
  disabled: false,
})

const target = computed(() => props.to || 'body')

/** 小程序端没有 document 或选择器无效时，安全降级为原位渲染。 */
const enabled = computed(() => {
  if (props.disabled || typeof document === 'undefined') {
    return false
  }
  try {
    return Boolean(document.querySelector(target.value))
  } catch {
    return false
  }
})
</script>

<style lang="scss">
@import './index.scss';
</style>
