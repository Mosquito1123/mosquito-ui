<template>
  <text class="mq-text" :class="rootClass" :style="rootStyle" @click.stop="onClick">
    <slot>{{ display }}</slot>
  </text>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatDisplayText } from '../../utils/model'
import type { MqTextEmits, MqTextProps } from './types'

defineOptions({
  name: 'mq-text',
})

const props = withDefaults(defineProps<MqTextProps>(), {
  text: '',
  type: 'default',
  mode: 'text',
  color: '',
  size: '',
  bold: false,
  lines: 0,
  decoration: 'none',
  prefix: '',
  suffix: '',
})

const emit = defineEmits<MqTextEmits>()

const display = computed(() =>
  formatDisplayText(props.text, {
    mode: props.mode,
    prefix: props.prefix,
    suffix: props.suffix,
  }),
)

const rootClass = computed(() => [
  props.type !== 'default' ? `is-${props.type}` : undefined,
  {
    'is-bold': props.bold,
    'is-underline': props.decoration === 'underline',
    'is-line-through': props.decoration === 'line-through',
    'is-clamp': Number.isFinite(props.lines) && props.lines > 0,
  },
])

const rootStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.color) {
    style.color = props.color
  }
  if (typeof props.size === 'number' && Number.isFinite(props.size) && props.size > 0) {
    style.fontSize = `${props.size}px`
  } else if (typeof props.size === 'string' && props.size.trim()) {
    style.fontSize = props.size.trim()
  }
  if (Number.isFinite(props.lines) && props.lines > 0) {
    style.webkitLineClamp = String(Math.floor(props.lines))
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
