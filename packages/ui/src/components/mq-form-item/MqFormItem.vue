<template>
  <view class="mq-form-item" :class="rootClass" @click.stop="onClick">
    <view v-if="title || label || showRequired" class="mq-form-item__title" :style="titleStyle">
      <text v-if="showRequired && asteriskPosition === 'start'" class="mq-form-item__star" aria-hidden="true">*</text>
      <view>
        <text>{{ title }}</text>
        <text v-if="label" class="mq-form-item__label">{{ label }}</text>
      </view>
      <text v-if="showRequired && asteriskPosition === 'end'" class="mq-form-item__star is-end" aria-hidden="true">*</text>
    </view>
    <view class="mq-form-item__body" :class="`is-${valueAlign}`">
      <slot>
        <text v-if="hasValue" class="mq-form-item__value">{{ value }}</text>
        <text v-else-if="placeholder" class="mq-form-item__value is-placeholder">{{ placeholder }}</text>
      </slot>
      <text v-if="isLink" class="mq-form-item__arrow" aria-hidden="true">›</text>
      <text v-if="showMessage && errorMessage" class="mq-form-item__error">{{ errorMessage }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { formKey } from '../mq-form/context'
import type { MqFormItemEmits, MqFormItemProps } from './types'

defineOptions({
  name: 'mq-form-item',
})

const props = withDefaults(defineProps<MqFormItemProps>(), {
  prop: '',
  title: '',
  label: '',
  placeholder: '',
  required: undefined,
  disabled: undefined,
  border: undefined,
  center: undefined,
  layout: undefined,
  valueAlign: undefined,
  asteriskPosition: undefined,
  hideAsterisk: undefined,
  clickable: false,
  isLink: false,
})

const emit = defineEmits<MqFormItemEmits>()
const form = inject(formKey, null)

const disabled = computed(() => props.disabled ?? form?.disabled.value ?? false)
const border = computed(() => props.border ?? form?.border.value ?? false)
const center = computed(() => props.center ?? form?.center.value ?? false)
const layout = computed(() => props.layout ?? form?.layout.value ?? 'horizontal')
const valueAlign = computed(() => props.valueAlign ?? form?.valueAlign.value ?? 'left')
const asteriskPosition = computed(
  () => props.asteriskPosition ?? form?.asteriskPosition.value ?? 'start',
)
const hideAsterisk = computed(() => props.hideAsterisk ?? form?.hideAsterisk.value ?? false)

const schemaRequired = computed(() => {
  if (!props.prop || !form?.schema.value?.isRequired) {
    return false
  }
  return Boolean(form.schema.value.isRequired(props.prop))
})

const showRequired = computed(() => {
  if (hideAsterisk.value) {
    return false
  }
  if (props.required !== undefined) {
    return props.required
  }
  return schemaRequired.value
})

const errorMessage = computed(() => (props.prop ? form?.errors.value[props.prop] || '' : ''))
const showMessage = computed(() => (form?.errorType.value || 'message') === 'message')

const hasValue = computed(() => {
  if (props.value == null) {
    return false
  }
  if (typeof props.value === 'number') {
    return Number.isFinite(props.value)
  }
  return props.value !== ''
})

const titleStyle = computed(() => {
  const width = props.titleWidth ?? form?.titleWidth.value
  if (width == null || width === '') {
    return undefined
  }
  return {
    width: typeof width === 'number' ? `${width}px` : String(width),
  }
})

const rootClass = computed(() => ({
  'is-border': border.value,
  'is-center': center.value,
  'is-vertical': layout.value === 'vertical',
  'is-disabled': disabled.value,
  'is-clickable': (props.clickable || props.isLink) && !disabled.value,
}))

function onClick(event: Event) {
  if (disabled.value) {
    return
  }
  emit('click', event)
}
</script>

<style lang="scss">
@import './index.scss';
</style>
