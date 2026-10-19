<template>
  <view class="mq-segmented" :class="[`is-${theme}`, { 'is-disabled': disabled }]" role="tablist">
    <text
      v-for="item in items"
      :key="String(item.value)"
      class="mq-segmented__item"
      :class="{ 'is-active': item.value === modelValue, 'is-disabled': item.disabled || disabled }"
      role="tab"
      :aria-selected="item.value === modelValue ? 'true' : 'false'"
      :aria-disabled="item.disabled || disabled ? 'true' : undefined"
      @click.stop="onSelect(item)"
    >
      {{ item.label }}
    </text>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MqSegmentedEmits, MqSegmentedItem, MqSegmentedProps } from './types'

defineOptions({
  name: 'mq-segmented',
})

const props = withDefaults(defineProps<MqSegmentedProps>(), {
  options: () => [],
  disabled: false,
  theme: 'card',
})

const emit = defineEmits<MqSegmentedEmits>()

const items = computed<MqSegmentedItem[]>(() =>
  props.options.map((item) => {
    if (typeof item === 'string' || typeof item === 'number') {
      return { value: item, label: String(item), disabled: false }
    }
    return {
      value: item.value,
      label: item.label?.trim() || String(item.value),
      disabled: Boolean(item.disabled),
    }
  }),
)

function onSelect(item: MqSegmentedItem) {
  if (props.disabled || item.disabled || item.value === props.modelValue) {
    return
  }
  emit('update:modelValue', item.value)
  emit('change', { value: item.value })
}
</script>

<style lang="scss">
@import './index.scss';
</style>
