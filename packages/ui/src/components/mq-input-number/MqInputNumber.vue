<template>
  <view class="mq-input-number" :class="{ 'is-disabled': disabled, 'is-without-input': withoutInput }">
    <text
      class="mq-input-number__btn"
      :class="{ 'is-disabled': minusDisabled }"
      role="button"
      :aria-disabled="minusDisabled ? 'true' : undefined"
      @click.stop="onStep(-1)"
    >
      −
    </text>
    <input
      v-if="!withoutInput"
      class="mq-input-number__control"
      type="digit"
      :value="String(display)"
      :style="inputStyle"
      :placeholder="placeholder"
      :disabled="disabled || disableInput"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
    />
    <text
      class="mq-input-number__btn"
      :class="{ 'is-disabled': plusDisabled }"
      role="button"
      :aria-disabled="plusDisabled ? 'true' : undefined"
      @click.stop="onStep(1)"
    >
      +
    </text>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { snapNumber } from '../../utils/model'
import type { MqInputNumberEmits, MqInputNumberProps } from './types'

defineOptions({
  name: 'mq-input-number',
})

const props = withDefaults(defineProps<MqInputNumberProps>(), {
  modelValue: 0,
  min: 0,
  max: Number.MAX_SAFE_INTEGER,
  step: 1,
  precision: 0,
  stepStrictly: false,
  disabled: false,
  disableInput: false,
  disableMinus: false,
  disablePlus: false,
  withoutInput: false,
  allowNull: false,
  immediateChange: true,
  inputWidth: undefined,
  placeholder: '',
})

const emit = defineEmits<MqInputNumberEmits>()
const pending = ref(false)

function modelNumber(): number {
  const value = props.modelValue
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }
  return Number.isFinite(props.min) ? props.min : 0
}

const display = computed<number | ''>(() =>
  props.allowNull && props.modelValue === ''
    ? ''
    : snapNumber(modelNumber(), props.min, props.max, props.step, props.precision, props.stepStrictly),
)

const current = computed(() => (display.value === '' ? modelNumber() : display.value))

const minusDisabled = computed(
  () => props.disabled || props.disableMinus || pending.value || current.value <= props.min,
)
const plusDisabled = computed(
  () => props.disabled || props.disablePlus || pending.value || current.value >= props.max,
)

const inputStyle = computed(() => {
  if (props.inputWidth === undefined) {
    return undefined
  }
  return { width: typeof props.inputWidth === 'number' ? `${props.inputWidth}px` : props.inputWidth }
})

async function commit(next: number) {
  const value = snapNumber(next, props.min, props.max, props.step, props.precision, props.stepStrictly)
  if (value === display.value) {
    return
  }
  if (props.beforeChange) {
    pending.value = true
    try {
      const allowed = await props.beforeChange(value)
      if (allowed === false) {
        return
      }
    } catch {
      return
    } finally {
      pending.value = false
    }
  }
  if (props.disabled) {
    return
  }
  emit('update:modelValue', value)
  emit('change', { value })
}

function commitEmpty() {
  if (!props.allowNull || props.disabled || props.disableInput || props.modelValue === '') {
    return
  }
  emit('update:modelValue', '')
  emit('change', { value: '' })
}

function onStep(direction: 1 | -1) {
  if ((direction < 0 && minusDisabled.value) || (direction > 0 && plusDisabled.value)) {
    return
  }
  const stride = Number.isFinite(props.step) && props.step > 0 ? props.step : 1
  void commit(current.value + direction * stride)
}

function readRaw(event: Event): string | number | undefined {
  const detail = (event as Event & { detail?: { value?: string | number } }).detail
  return detail?.value ?? (event.target as { value?: string } | null)?.value ?? undefined
}

function readNumber(event: Event): number | undefined {
  const raw = readRaw(event)
  if (raw == null || raw === '') {
    return undefined
  }
  const parsed = typeof raw === 'number' ? raw : Number.parseFloat(String(raw))
  return Number.isFinite(parsed) ? parsed : undefined
}

function eventValue(event: Event): number | string {
  const raw = readRaw(event)
  if (raw == null || raw === '') {
    return props.allowNull && raw === '' ? '' : display.value
  }
  const parsed = typeof raw === 'number' ? raw : Number.parseFloat(String(raw))
  return Number.isFinite(parsed) ? parsed : String(raw)
}

function onInput(event: Event) {
  if (props.disabled || props.disableInput || !props.immediateChange) {
    return
  }
  if (props.allowNull && readRaw(event) === '') {
    commitEmpty()
    return
  }
  const parsed = readNumber(event)
  if (parsed === undefined) {
    return
  }
  void commit(parsed)
}

function onFocus(event: Event) {
  emit('focus', { value: eventValue(event) })
}

function onBlur(event: Event) {
  emit('blur', { value: eventValue(event) })
  if (props.disabled || props.disableInput) {
    return
  }
  if (props.allowNull && readRaw(event) === '') {
    commitEmpty()
    return
  }
  const parsed = readNumber(event)
  void commit(parsed === undefined ? current.value : parsed)
}
</script>

<style lang="scss">
@import './index.scss';
</style>
