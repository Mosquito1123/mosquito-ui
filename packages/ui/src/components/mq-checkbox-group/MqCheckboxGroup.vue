<template>
  <view class="mq-checkbox-group" :class="`mq-checkbox-group--${direction}`" role="group">
    <slot />
  </view>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'
import { toggleCheckedValues } from '../../utils/model'
import { checkboxGroupKey } from '../mq-checkbox/context'
import type { MqCheckboxGroupEmits, MqCheckboxGroupProps } from './types'

defineOptions({
  name: 'mq-checkbox-group',
})

const props = withDefaults(defineProps<MqCheckboxGroupProps>(), {
  modelValue: () => [],
  type: 'circle',
  disabled: false,
  readonly: false,
  min: 0,
  max: 0,
  placement: 'left',
  direction: 'vertical',
  checkedColor: '',
  uncheckedColor: '',
})

const emit = defineEmits<MqCheckboxGroupEmits>()

function toggle(name: (typeof props.modelValue)[number]) {
  if (props.disabled || props.readonly) {
    return
  }
  const next = toggleCheckedValues(props.modelValue, name, props.min, props.max)
  if (!next) {
    return
  }
  emit('update:modelValue', next)
  emit('change', { value: next })
}

provide(checkboxGroupKey, {
  disabled: computed(() => props.disabled),
  readonly: computed(() => props.readonly),
  type: computed(() => props.type),
  placement: computed(() => props.placement),
  checkedColor: computed(() => props.checkedColor),
  uncheckedColor: computed(() => props.uncheckedColor),
  isChecked: (name) => props.modelValue.some((item) => item === name),
  toggle,
})
</script>

<style lang="scss">
@import './index.scss';
</style>
