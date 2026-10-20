<template>
  <view class="mq-avatar" :class="rootClass" :style="rootStyle" role="img" :aria-label="alt || text || mark || 'avatar'" @click.stop="onClick">
    <image v-if="src" class="mq-avatar__img" :src="src" mode="aspectFill" />
    <text v-else>{{ text || mark || '?' }}</text>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MqAvatarEmits, MqAvatarProps } from './types'

defineOptions({
  name: 'mq-avatar',
})

const props = withDefaults(defineProps<MqAvatarProps>(), {
  src: '',
  text: '',
  mark: '',
  shape: 'round',
  size: 'normal',
  bgColor: '',
  color: '',
  alt: '',
})

const emit = defineEmits<MqAvatarEmits>()

const preset = computed(() => {
  const size = props.size
  return size === 'large' || size === 'medium' || size === 'normal' || size === 'small' ? size : ''
})

const rootClass = computed(() => [
  `is-${props.shape}`,
  preset.value ? `is-${preset.value}` : undefined,
])

const rootStyle = computed(() => {
  const style: Record<string, string> = {}
  if (!preset.value) {
    const size =
      typeof props.size === 'number' && Number.isFinite(props.size)
        ? `${props.size}px`
        : String(props.size || '40px')
    style.width = size
    style.height = size
  }
  if (props.bgColor) {
    style.backgroundColor = props.bgColor
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
