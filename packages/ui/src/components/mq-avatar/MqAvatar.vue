<template>
  <view
    v-if="!hidden"
    class="mq-avatar"
    :class="rootClass"
    :style="rootStyle"
    role="img"
    :aria-label="alt || text || mark || 'avatar'"
    @click.stop="onClick"
  >
    <image
      v-if="showImage"
      class="mq-avatar__img"
      :src="src"
      mode="aspectFill"
      @error="failed = true"
    />
    <text v-else>{{ text || mark || '?' }}</text>
  </view>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { resolveAvatarSize } from '../../utils/model'
import { avatarGroupKey } from '../mq-avatar-group/context'
import type { MqAvatarEmits, MqAvatarProps } from './types'

defineOptions({
  name: 'mq-avatar',
})

const props = withDefaults(defineProps<MqAvatarProps>(), {
  src: '',
  text: '',
  mark: '',
  shape: undefined,
  size: undefined,
  bgColor: '',
  color: '',
  alt: '',
})

const emit = defineEmits<MqAvatarEmits>()

const group = inject(avatarGroupKey, null)
const id = Symbol('mq-avatar')
const failed = ref(false)

const size = computed(() => String(props.size ?? group?.size.value ?? 'normal'))
const shape = computed(() => props.shape ?? group?.shape.value ?? 'round')

const preset = computed(() =>
  size.value === 'large' || size.value === 'medium' || size.value === 'normal' || size.value === 'small'
    ? size.value
    : ''
)

const index = computed(() => (group ? group.items.value.indexOf(id) : -1))
const hidden = computed(() => {
  const max = group?.maxCount.value ?? 0
  return max > 0 && index.value >= max
})

const showImage = computed(() => Boolean(props.src) && !failed.value)

const rootClass = computed(() => [
  `is-${shape.value}`,
  preset.value ? `is-${preset.value}` : undefined,
])

const rootStyle = computed(() => {
  const style: Record<string, string> = {}
  if (!preset.value) {
    const px = resolveAvatarSize(size.value, 40)
    style.width = `${px}px`
    style.height = `${px}px`
    style.fontSize = `${Math.max(11, Math.round(px * 0.4))}px`
  }
  if (props.bgColor) {
    style.backgroundColor = props.bgColor
  }
  if (props.color) {
    style.color = props.color
  }
  return style
})

watch(
  () => props.src,
  () => {
    failed.value = false
  },
)

onMounted(() => {
  group?.register(id)
})

onBeforeUnmount(() => {
  group?.unregister(id)
})

function onClick(event: Event) {
  emit('click', event)
}
</script>

<style lang="scss">
@import './index.scss';
</style>
