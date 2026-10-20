<template>
  <view class="mq-config-provider" :class="themeClass" :style="rootStyle">
    <slot />
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MqConfigProviderProps } from './types'

defineOptions({
  name: 'mq-config-provider',
})

const props = withDefaults(defineProps<MqConfigProviderProps>(), {
  theme: 'light',
  themeVars: () => ({}),
})

const themeClass = computed(() => (props.theme === 'dark' ? 'mq-theme-dark' : 'mq-theme-light'))

const rootStyle = computed(() => {
  const style: Record<string, string> = {}
  for (const [key, value] of Object.entries(props.themeVars || {})) {
    if (!key || value == null) {
      continue
    }
    const name = key.startsWith('--') ? key : `--${key}`
    style[name] = String(value)
  }
  return style
})
</script>

<style lang="scss">
@import './index.scss';
</style>
