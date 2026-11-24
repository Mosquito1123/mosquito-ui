<template>
  <view
    class="mq-icon"
    :class="{ 'is-bold': bold, 'is-block': block }"
    :style="rootStyle"
    :aria-label="name || undefined"
    @click="onClick"
  >
    <slot v-if="hasDefaultSlot" />
    <text v-else class="mq-icon__glyph">{{ glyph }}</text>
  </view>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import type { MqIconEmits, MqIconProps } from './types'

defineOptions({
  name: 'mq-icon',
})

const props = withDefaults(defineProps<MqIconProps>(), {
  name: '',
  size: 16,
  color: '',
  bold: false,
  block: false,
})

const emit = defineEmits<MqIconEmits>()
const slots = useSlots()

/** 不引入图标字体，直接映射到常见 unicode 字形。 */
const GLYPHS: Record<string, string> = {
  add: '+',
  close: '×',
  'arrow-left': '‹',
  'arrow-right': '›',
  'arrow-down': '▾',
  'arrow-up': '▴',
  check: '✓',
  search: '⌕',
  star: '★',
  heart: '♥',
  refresh: '↻',
  more: '⋯',
  info: 'i',
  success: '✓',
  warning: '!',
  error: '×',
  camera: '▣',
  image: '▧',
  location: '⌖',
  phone: '✆',
  shop: '▥',
  user: '☻',
  delete: '⌫',
  edit: '✎',
  chat: '❞',
  clock: '◷',
  gift: '❁',
}

const hasDefaultSlot = computed(() => Boolean(slots.default))

const glyph = computed(() => {
  const key = props.name || ''
  return GLYPHS[key] ?? (key ? key.charAt(0) : '')
})

function dimension(value: string | number): string {
  return typeof value === 'number' ? `${value}px` : value
}

const rootStyle = computed<Record<string, string>>(() => {
  const style: Record<string, string> = {
    fontSize: dimension(props.size),
  }
  if (props.color) {
    style.color = props.color
  }
  return style
})

function onClick(event: Event) {
  emit('click', event)
}
</script>

<style lang="scss">
@import './index.scss';
</style>
