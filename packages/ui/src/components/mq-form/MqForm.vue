<template>
  <view class="mq-form" :class="{ 'is-border': border }">
    <slot />
  </view>
</template>

<script setup lang="ts">
import { computed, provide, ref, watch } from 'vue'
import { showToast } from '../../utils/toast'
import { formKey } from './context'
import type { MqFormProps, MqFormValidateResult } from './types'

defineOptions({
  name: 'mq-form',
})

const props = withDefaults(defineProps<MqFormProps>(), {
  model: () => ({}),
  errorType: 'message',
  disabled: false,
  border: false,
  center: false,
  layout: 'horizontal',
  valueAlign: 'left',
  asteriskPosition: 'start',
  hideAsterisk: false,
  resetOnChange: true,
})

const errors = ref<Record<string, string>>({})

function clearError(prop?: string) {
  if (!prop) {
    errors.value = {}
    return
  }
  if (!(prop in errors.value)) {
    return
  }
  const next = { ...errors.value }
  delete next[prop]
  errors.value = next
}

function setError(prop: string, message: string) {
  if (!prop) {
    return
  }
  errors.value = { ...errors.value, [prop]: message }
}

async function validate(prop?: string | string[]): Promise<MqFormValidateResult> {
  const schema = props.schema
  if (!schema) {
    return { valid: true, errors: [] }
  }
  const issues = await schema.validate(props.model || {})
  const list = Array.isArray(issues) ? issues : []
  const mapped = list
    .map((issue) => ({
      prop: String(issue.path?.[0] ?? ''),
      message: issue.message || '',
    }))
    .filter((item) => item.prop && item.message)

  const filter =
    prop == null
      ? null
      : new Set(Array.isArray(prop) ? prop : [prop])

  const selected = filter
    ? mapped.filter((item) => filter.has(item.prop))
    : mapped

  if (filter) {
    for (const key of filter) {
      clearError(key)
    }
  } else {
    clearError()
  }

  for (const item of selected) {
    setError(item.prop, item.message)
  }

  if (props.errorType === 'toast' && selected[0]) {
    showToast(selected[0].message)
  }

  return {
    valid: selected.length === 0,
    errors: selected,
  }
}

function reset() {
  clearError()
}

watch(
  () => props.model,
  () => {
    if (props.resetOnChange) {
      clearError()
    }
  },
  { deep: true },
)

provide(formKey, {
  model: computed(() => props.model || {}),
  schema: computed(() => props.schema),
  errorType: computed(() => props.errorType),
  disabled: computed(() => props.disabled),
  border: computed(() => props.border),
  center: computed(() => props.center),
  titleWidth: computed(() => props.titleWidth),
  layout: computed(() => props.layout),
  valueAlign: computed(() => props.valueAlign),
  asteriskPosition: computed(() => props.asteriskPosition),
  hideAsterisk: computed(() => props.hideAsterisk),
  errors,
  clearError,
  setError,
})

defineExpose({
  validate,
  reset,
})
</script>

<style lang="scss">
@import './index.scss';
</style>
