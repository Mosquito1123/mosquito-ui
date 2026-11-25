<template>
  <view
    class="mq-checkbox"
    :class="[
      `mq-checkbox--${mergedType}`,
      {
        'is-checked': checked,
        'is-indeterminate': indeterminate,
        'is-disabled': mergedDisabled,
        'is-readonly': mergedReadonly,
        'is-placement-right': mergedPlacement === 'right' && mergedType !== 'button',
      },
    ]"
    :style="rootStyle"
    role="checkbox"
    :aria-checked="indeterminate ? 'mixed' : checked ? 'true' : 'false'"
    :aria-disabled="mergedDisabled ? 'true' : undefined"
    @click.stop="onClick"
    @keydown.enter.prevent="onClick"
    @keydown.space.prevent="onClick"
  >
    <text class="mq-checkbox__label"><slot /></text>
  </view>
</template>

<script setup lang="ts">
import { computed, inject, onUnmounted, watch } from 'vue'
import { checkboxGroupKey } from './context'
import type { MqCheckboxGroupChildState } from './context'
import type { MqCheckboxEmits, MqCheckboxProps } from './types'

defineOptions({
  name: 'mq-checkbox',
})

const props = withDefaults(defineProps<MqCheckboxProps>(), {
  modelValue: false,
  trueValue: true,
  falseValue: false,
  indeterminate: false,
})

const emit = defineEmits<MqCheckboxEmits>()
const group = inject(checkboxGroupKey, null)

const mergedType = computed(() => props.type ?? group?.type.value ?? 'circle')
const mergedDisabled = computed(() => props.disabled ?? group?.disabled.value ?? false)
const mergedReadonly = computed(() => props.readonly ?? group?.readonly.value ?? false)
const mergedPlacement = computed(() => props.placement ?? group?.placement.value ?? 'left')
const checked = computed(() => {
  if (group) {
    if (props.name === undefined) {
      return false
    }
    return group.isChecked(props.name)
  }
  return props.modelValue === props.trueValue
})

const rootStyle = computed(() => {
  const style: Record<string, string> = {}
  const on = props.checkedColor || group?.checkedColor.value
  const off = props.uncheckedColor || group?.uncheckedColor.value
  if (on) {
    style['--mq-check-on'] = on
  }
  if (off) {
    style['--mq-check-off'] = off
  }
  return style
})

function toggle() {
  if (mergedDisabled.value || mergedReadonly.value) {
    return
  }
  if (group) {
    if (props.name === undefined) {
      return
    }
    group.toggle(props.name)
    return
  }
  const next = checked.value ? props.falseValue : props.trueValue
  emit('update:modelValue', next)
  emit('change', { value: next })
}

function onClick() {
  toggle()
}

// 组内注册，供父级的 toggleAll / clear 判断哪些子项参与批量切换。
const childState: MqCheckboxGroupChildState = {
  name: () => props.name,
  disabled: () => mergedDisabled.value || mergedReadonly.value,
}
let registered = false
function syncRegistration() {
  if (!group) {
    return
  }
  if (props.name !== undefined && !registered) {
    group.register(childState)
    registered = true
  } else if (props.name === undefined && registered) {
    group.unregister(childState)
    registered = false
  }
}
syncRegistration()
watch(() => props.name, syncRegistration)
onUnmounted(() => {
  if (registered) {
    group?.unregister(childState)
  }
})

defineExpose({ toggle })
</script>

<style lang="scss">
@import './index.scss';
</style>
