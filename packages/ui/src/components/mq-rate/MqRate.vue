<template>
  <view
    class="mq-rate"
    :class="{ 'is-disabled': disabled, 'is-readonly': readonly }"
    :style="rootStyle"
    role="slider"
    aria-label="评分"
    :aria-valuemin="0"
    :aria-valuemax="count"
    :aria-valuenow="safeValue"
    :aria-disabled="inactive ? 'true' : undefined"
  >
    <text
      v-for="star in count"
      :key="star"
      class="mq-rate__star"
      :style="starStyle(star)"
      @click.stop="onStar($event, star)"
    >
      <text class="mq-rate__base">★</text>
      <text class="mq-rate__fill" :style="{ width: fillOf(star) }">★</text>
    </text>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { nextRateValue, resolvePx } from '../../utils/model'
import type { MqRateEmits, MqRateProps } from './types'

defineOptions({
  name: 'mq-rate',
})

const props = withDefaults(defineProps<MqRateProps>(), {
  modelValue: 0,
  num: 5,
  readonly: false,
  disabled: false,
  color: '',
  activeColor: '',
  allowHalf: false,
  clearable: false,
})

const emit = defineEmits<MqRateEmits>()

const count = computed(() => {
  if (!Number.isFinite(props.num) || props.num < 1) {
    return 5
  }
  return Math.floor(props.num)
})

const safeValue = computed(() => {
  if (typeof props.modelValue !== 'number' || !Number.isFinite(props.modelValue)) {
    return 0
  }
  return Math.min(count.value, Math.max(0, props.modelValue))
})

const inactive = computed(() => props.disabled || props.readonly)

const rootStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.color) {
    style['--mq-rate-off'] = props.color
  }
  if (props.activeColor) {
    style['--mq-rate-on'] = props.activeColor
  }
  return style
})

function starStyle(star: number): Record<string, string> {
  const style: Record<string, string> = {
    fontSize: `${resolvePx(props.size, 22)}px`,
  }
  if (star < count.value) {
    style.marginRight = `${resolvePx(props.space, 4)}px`
  }
  return style
}

function fillOf(star: number): string {
  if (safeValue.value >= star) {
    return '100%'
  }
  if (safeValue.value >= star - 0.5) {
    return '50%'
  }
  return '0%'
}

function prefersHalf(event: Event): boolean {
  if (!props.allowHalf) {
    return false
  }
  const mouse = event as MouseEvent
  const target = event.currentTarget as { getBoundingClientRect?: () => { left: number; width: number } } | null
  if (typeof mouse.clientX !== 'number' || !target?.getBoundingClientRect) {
    return false
  }
  const rect = target.getBoundingClientRect()
  if (!rect.width) {
    return false
  }
  return mouse.clientX - rect.left < rect.width / 2
}

function onStar(event: Event, star: number) {
  if (inactive.value) {
    return
  }
  const next = nextRateValue(props.modelValue, star, prefersHalf(event), props.clearable, count.value)
  if (next === props.modelValue) {
    return
  }
  emit('update:modelValue', next)
  emit('change', { value: next })
}
</script>

<style lang="scss">
@import './index.scss';
</style>
