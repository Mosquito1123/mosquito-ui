<template>
  <view class="mq-checkbox-group" :class="`mq-checkbox-group--${direction}`" role="group">
    <slot />
  </view>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'
import { toggleCheckedValues } from '../../utils/model'
import type { MqOptionValue } from '../../utils/model'
import { checkboxGroupKey } from '../mq-checkbox/context'
import type { MqCheckboxGroupChildState } from '../mq-checkbox/context'
import type { MqCheckboxGroupEmits, MqCheckboxGroupProps, MqCheckboxGroupToggleAllOptions } from './types'

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

const children: MqCheckboxGroupChildState[] = []

function register(child: MqCheckboxGroupChildState) {
  if (!children.includes(child)) {
    children.push(child)
  }
}

function unregister(child: MqCheckboxGroupChildState) {
  const index = children.indexOf(child)
  if (index >= 0) {
    children.splice(index, 1)
  }
}

function commit(next: MqOptionValue[]) {
  if (
    next.length === props.modelValue.length &&
    next.every((item, index) => item === props.modelValue[index])
  ) {
    return
  }
  emit('update:modelValue', next)
  emit('change', { value: next })
}

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

/** 传布尔值指定目标状态，不传参逐个取反；skipDisabled 保留禁用 / 只读子项的原状态。 */
function toggleAll(checkedOrOptions?: boolean | MqCheckboxGroupToggleAllOptions, skipDisabled = false) {
  if (props.disabled || props.readonly) {
    return
  }
  let checked: boolean | undefined
  let skip = skipDisabled
  if (typeof checkedOrOptions === 'boolean') {
    checked = checkedOrOptions
  } else if (checkedOrOptions) {
    checked = checkedOrOptions.checked
    skip = checkedOrOptions.skipDisabled ?? skipDisabled
  }
  let next = [...props.modelValue]
  for (const child of children) {
    const name = child.name()
    if (name === undefined || (skip && child.disabled())) {
      continue
    }
    const isChecked = next.some((item) => item === name)
    const target = checked === undefined ? !isChecked : checked
    if (target === isChecked) {
      continue
    }
    const result = toggleCheckedValues(next, name, props.min, props.max)
    if (result) {
      next = result
    }
  }
  commit(next)
}

function clear() {
  if (props.disabled || props.readonly) {
    return
  }
  let next = [...props.modelValue]
  for (const value of props.modelValue) {
    const result = toggleCheckedValues(next, value, props.min, props.max)
    if (result) {
      next = result
    }
  }
  commit(next)
}

defineExpose({ toggleAll, clear })

provide(checkboxGroupKey, {
  disabled: computed(() => props.disabled),
  readonly: computed(() => props.readonly),
  type: computed(() => props.type),
  placement: computed(() => props.placement),
  checkedColor: computed(() => props.checkedColor),
  uncheckedColor: computed(() => props.uncheckedColor),
  isChecked: (name) => props.modelValue.some((item) => item === name),
  toggle,
  register,
  unregister,
})
</script>

<style lang="scss">
@import './index.scss';
</style>
