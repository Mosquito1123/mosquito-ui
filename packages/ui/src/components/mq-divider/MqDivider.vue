<template>
  <view
    class="mq-divider"
    :class="[
      `is-${contentPosition}`,
      {
        'is-dashed': dashed,
        'is-vertical': vertical,
        'is-hairline': hairline && !vertical,
      },
    ]"
    :style="rootStyle"
    role="separator"
  >
    <text v-if="!vertical && slots.default" class="mq-divider__text"><slot /></text>
  </view>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import type { MqDividerProps } from './types'

defineOptions({
  name: 'mq-divider',
})

const props = withDefaults(defineProps<MqDividerProps>(), {
  color: '',
  contentPosition: 'center',
  dashed: false,
  vertical: false,
  hairline: true,
})

const slots = useSlots()

const rootStyle = computed(() => {
  if (!props.color) {
    return undefined
  }
  const style: Record<string, string> = {
    color: props.color,
    '--mq-divider-color': props.color,
  }
  return style
})
</script>

<style lang="scss">
@import './index.scss';
</style>
