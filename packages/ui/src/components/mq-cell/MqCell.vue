<template>
  <view
    class="mq-cell"
    :class="[
      {
        'is-link': isLink,
        'is-clickable': interactive,
        'is-disabled': disabled,
        'has-border': border,
        'is-ellipsis': ellipsis,
        'is-center': center,
      },
      `mq-cell--${size}`,
    ]"
    :hover-class="interactive ? 'mq-cell--pressed' : 'none'"
    :role="interactive ? 'button' : undefined"
    :tabindex="interactive ? 0 : undefined"
    :aria-disabled="disabled ? 'true' : undefined"
    @click="onClick"
    @keydown.enter.prevent="onKeyActivate"
    @keydown.space.prevent="onKeyActivate"
  >
    <text v-if="flatTitle" class="mq-cell__title" :style="titleWidthStyle">{{ title }}</text>
    <view v-else class="mq-cell__main">
      <view class="mq-cell__title-row">
        <text v-if="required" class="mq-cell__star" aria-hidden="true">*</text>
        <text class="mq-cell__title" :style="titleWidthStyle">{{ title }}</text>
      </view>
      <text v-if="label" class="mq-cell__label">{{ label }}</text>
    </view>
    <text v-if="showValue" class="mq-cell__value" :class="valueAlignClass" :style="valueAlignStyle">{{
      value
    }}</text>
    <text
      v-else-if="placeholder"
      class="mq-cell__value is-placeholder"
      :class="valueAlignClass"
      :style="valueAlignStyle"
      >{{ placeholder }}</text
    >
    <text
      v-if="isLink"
      class="mq-cell__arrow"
      :class="`mq-cell__arrow--${arrowDirection}`"
      aria-hidden="true"
      >{{ arrowGlyph }}</text
    >
    <view v-if="slots.default" class="mq-cell__extra">
      <slot />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import type { MqCellArrowDirection, MqCellEmits, MqCellProps } from './types'

defineOptions({
  name: 'mq-cell',
})

const props = withDefaults(defineProps<MqCellProps>(), {
  title: '',
  label: '',
  placeholder: '',
  isLink: false,
  clickable: false,
  disabled: false,
  required: false,
  border: false,
  ellipsis: false,
  to: undefined,
  replace: false,
  arrowDirection: 'right',
  center: false,
  valueAlign: 'right',
  titleWidth: undefined,
  size: 'normal',
})

const emit = defineEmits<MqCellEmits>()
const slots = useSlots()

const interactive = computed(() => (props.isLink || props.clickable) && !props.disabled)
const flatTitle = computed(() => !props.label && !props.required)

const arrowGlyph = computed(() => {
  const glyphs: Record<MqCellArrowDirection, string> = {
    left: '‹',
    up: '▴',
    down: '▾',
    right: '›',
  }
  return glyphs[props.arrowDirection]
})

const titleWidthStyle = computed(() => {
  const width = props.titleWidth
  if (width == null || width === '') {
    return undefined
  }
  return { width: typeof width === 'number' ? `${width}px` : width }
})

const valueAlignClass = computed(() => `mq-cell__value--${props.valueAlign}`)
const valueAlignStyle = computed(() => ({ textAlign: props.valueAlign }))

const showValue = computed(() => {
  const value = props.value
  if (value == null) {
    return false
  }
  if (typeof value === 'number') {
    return Number.isFinite(value)
  }
  return value !== ''
})

type UniNavigationApi = {
  navigateTo?: (options: { url: string }) => unknown
  redirectTo?: (options: { url: string }) => unknown
}

function navigate(url: string) {
  const uniApi = (globalThis as typeof globalThis & { uni?: UniNavigationApi }).uni
  if (!uniApi) {
    return
  }
  const method = props.replace ? uniApi.redirectTo : uniApi.navigateTo
  if (typeof method !== 'function') {
    return
  }
  method.call(uniApi, { url })
}

function onClick(event: Event) {
  if (props.disabled) {
    return
  }
  emit('click', event)
  if (props.to && interactive.value) {
    navigate(props.to)
  }
}

function onKeyActivate(event: Event) {
  if (!interactive.value) {
    return
  }
  onClick(event)
}
</script>

<style lang="scss">
@import './index.scss';
</style>
