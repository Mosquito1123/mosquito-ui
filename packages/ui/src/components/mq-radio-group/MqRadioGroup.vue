<template>
  <view class="mq-radio-group" :class="`mq-radio-group--${direction}`" role="radiogroup">
    <slot />
  </view>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'
import { nextRadioValue } from '../../utils/model'
import { radioGroupKey } from '../mq-radio/context'
import type { MqRadioGroupEmits, MqRadioGroupProps } from './types'

defineOptions({
  name: 'mq-radio-group',
})

const props = withDefaults(defineProps<MqRadioGroupProps>(), {
  type: 'circle',
  disabled: false,
  readonly: false,
  placement: 'left',
  direction: 'vertical',
  allowUncheck: false,
  checkedColor: '',
  uncheckedColor: '',
})

const emit = defineEmits<MqRadioGroupEmits>()

function select(value: NonNullable<MqRadioGroupProps['modelValue']>) {
  if (props.disabled || props.readonly) {
    return
  }
  const next = nextRadioValue(props.modelValue, value, props.allowUncheck)
  if (!next.changed) {
    return
  }
  emit('update:modelValue', next.value)
  emit('change', { value: next.value })
}

provide(radioGroupKey, {
  current: computed(() => props.modelValue),
  disabled: computed(() => props.disabled),
  readonly: computed(() => props.readonly),
  type: computed(() => props.type),
  placement: computed(() => props.placement),
  checkedColor: computed(() => props.checkedColor),
  uncheckedColor: computed(() => props.uncheckedColor),
  allowUncheck: computed(() => props.allowUncheck),
  select,
})
</script>

<style lang="scss">
@import './index.scss';
</style>
