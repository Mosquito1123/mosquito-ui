<template>
  <view class="mq-input-number" :class="{ 'is-disabled': disabled }">
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
      class="mq-input-number__control"
      type="digit"
      :value="String(display)"
      :disabled="disabled || disableInput"
      @input="onInput"
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
})

const emit = defineEmits<MqInputNumberEmits>()
const pending = ref(false)

const display = computed(() =>
  snapNumber(props.modelValue, props.min, props.max, props.step, props.precision, props.stepStrictly),
)

const minusDisabled = computed(
  () => props.disabled || props.disableMinus || pending.value || display.value <= props.min,
)
const plusDisabled = computed(
  () => props.disabled || props.disablePlus || pending.value || display.value >= props.max,
)

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

function onStep(direction: 1 | -1) {
  if ((direction < 0 && minusDisabled.value) || (direction > 0 && plusDisabled.value)) {
    return
  }
  const stride = Number.isFinite(props.step) && props.step > 0 ? props.step : 1
  void commit(display.value + direction * stride)
}

function readNumber(event: Event): number | undefined {
  const detail = (event as Event & { detail?: { value?: string | number } }).detail
  const raw = detail?.value ?? (event.target as { value?: string } | null)?.value
  if (raw == null || raw === '') {
    return undefined
  }
  const parsed = typeof raw === 'number' ? raw : Number.parseFloat(String(raw))
  return Number.isFinite(parsed) ? parsed : undefined
}

function onInput(event: Event) {
  if (props.disabled || props.disableInput) {
    return
  }
  const parsed = readNumber(event)
  if (parsed === undefined) {
    return
  }
  void commit(parsed)
}

function onBlur(event: Event) {
  if (props.disabled || props.disableInput) {
    return
  }
  const parsed = readNumber(event)
  void commit(parsed === undefined ? display.value : parsed)
}
</script>

<style lang="scss">
@import './index.scss';
</style>
