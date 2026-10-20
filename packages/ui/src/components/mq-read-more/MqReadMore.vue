<template>
  <view class="mq-read-more" :class="{ 'is-expanded': expanded, 'is-disabled': disabled }">
    <view class="mq-read-more__content" :class="{ 'is-collapsed': !expanded }" :style="contentStyle">
      <slot>{{ text }}</slot>
    </view>
    <view
      v-if="showToggle"
      class="mq-read-more__toggle"
      role="button"
      tabindex="0"
      :aria-expanded="expanded ? 'true' : 'false'"
      @click="toggle"
      @keydown.enter.prevent="toggle"
    >
      <text class="mq-read-more__toggle-text">{{ expanded ? collapseText : expandText }}</text>
      <text class="mq-read-more__arrow">{{ expanded ? '▴' : '▾' }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref, useSlots } from 'vue'
import type { MqReadMoreEmits, MqReadMoreProps } from './types'

defineOptions({
  name: 'mq-read-more',
})

const props = withDefaults(defineProps<MqReadMoreProps>(), {
  text: '',
  maxHeight: 120,
  expandText: '展开',
  collapseText: '收起',
  disabled: false,
  toggleable: undefined,
})

const emit = defineEmits<MqReadMoreEmits>()
const slots = useSlots()

const expanded = ref(false)

const showToggle = computed(() => {
  if (props.toggleable !== undefined) {
    return props.toggleable
  }
  if (props.text) {
    return props.text.length > 60
  }
  return Boolean(slots.default)
})

const contentStyle = computed(() => {
  if (expanded.value) {
    return undefined
  }
  const value = Number(props.maxHeight)
  return { maxHeight: `${Number.isFinite(value) && value > 0 ? value : 120}px` }
})

function toggle() {
  if (props.disabled) {
    return
  }
  expanded.value = !expanded.value
  emit('change', expanded.value)
}

function expand() {
  if (!expanded.value) {
    toggle()
  }
}

function collapse() {
  if (expanded.value) {
    toggle()
  }
}

defineExpose({
  toggle,
  expand,
  collapse,
})
</script>

<style lang="scss">
@import './index.scss';
</style>
