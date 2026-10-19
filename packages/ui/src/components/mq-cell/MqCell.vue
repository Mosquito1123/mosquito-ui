<template>
  <view
    class="mq-cell"
    :class="{
      'is-link': isLink,
      'is-clickable': interactive,
      'is-disabled': disabled,
      'has-border': border,
      'is-ellipsis': ellipsis,
    }"
    :hover-class="interactive ? 'mq-cell--pressed' : 'none'"
    :role="interactive ? 'button' : undefined"
    :tabindex="interactive ? 0 : undefined"
    :aria-disabled="disabled ? 'true' : undefined"
    @click="onClick"
    @keydown.enter.prevent="onKeyActivate"
    @keydown.space.prevent="onKeyActivate"
  >
    <text v-if="flatTitle" class="mq-cell__title">{{ title }}</text>
    <view v-else class="mq-cell__main">
      <view class="mq-cell__title-row">
        <text v-if="required" class="mq-cell__star" aria-hidden="true">*</text>
        <text class="mq-cell__title">{{ title }}</text>
      </view>
      <text v-if="label" class="mq-cell__label">{{ label }}</text>
    </view>
    <text v-if="showValue" class="mq-cell__value">{{ value }}</text>
    <text v-else-if="placeholder" class="mq-cell__value is-placeholder">{{ placeholder }}</text>
    <text v-if="isLink" class="mq-cell__arrow" aria-hidden="true">›</text>
    <view v-if="slots.default" class="mq-cell__extra">
      <slot />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import type { MqCellEmits, MqCellProps } from './types'

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
})

const emit = defineEmits<MqCellEmits>()
const slots = useSlots()

const interactive = computed(() => (props.isLink || props.clickable) && !props.disabled)
const flatTitle = computed(() => !props.label && !props.required)

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

function onClick(event: Event) {
  if (props.disabled) {
    return
  }
  emit('click', event)
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
