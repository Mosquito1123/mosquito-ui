<template>
  <view class="mq-slider" :class="{ 'is-disabled': disabled, 'has-edge': showExtremeValue }">
    <text v-if="showExtremeValue" class="mq-slider__edge">{{ bounds.min }}</text>
    <slider
      class="mq-slider__control"
      :min="bounds.min"
      :max="bounds.max"
      :step="bounds.step"
      :value="display"
      :disabled="disabled"
      :activeColor="activeColor || undefined"
      :backgroundColor="inactiveColor || undefined"
      @changing="onChanging"
      @change="onChange"
    />
    <text v-if="showExtremeValue" class="mq-slider__edge">{{ bounds.max }}</text>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { snapSlider } from '../../utils/model'
import type { MqSliderEmits, MqSliderProps } from './types'

defineOptions({
  name: 'mq-slider',
})

const props = withDefaults(defineProps<MqSliderProps>(), {
  modelValue: 0,
  min: 0,
  max: 100,
  step: 1,
  disabled: false,
  showExtremeValue: false,
  activeColor: '',
  inactiveColor: '',
})

const emit = defineEmits<MqSliderEmits>()
const dragging = ref(false)

const bounds = computed(() => {
  const min = Number.isFinite(props.min) ? props.min : 0
  const max = Number.isFinite(props.max) ? props.max : 100
  const step = Number.isFinite(props.step) && props.step > 0 ? props.step : 1
  return {
    min: Math.min(min, max),
    max: Math.max(min, max),
    step,
  }
})

const display = computed(() => snapSlider(props.modelValue, bounds.value.min, bounds.value.max, bounds.value.step))

function readNumber(event: Event): number {
  const detail = (event as Event & { detail?: { value?: number | string } }).detail
  const raw = detail?.value
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    return raw
  }
  if (typeof raw === 'string') {
    const parsed = Number.parseFloat(raw)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }
  return display.value
}

function snapped(event: Event): number {
  return snapSlider(readNumber(event), bounds.value.min, bounds.value.max, bounds.value.step)
}

function onChanging(event: Event) {
  if (props.disabled) {
    return
  }
  const value = snapped(event)
  if (!dragging.value) {
    dragging.value = true
    emit('dragstart', { value })
  }
  emit('update:modelValue', value)
  emit('dragmove', { value })
}

function onChange(event: Event) {
  if (props.disabled) {
    return
  }
  const value = snapped(event)
  const wasDragging = dragging.value
  dragging.value = false
  emit('update:modelValue', value)
  emit('change', { value })
  if (wasDragging) {
    emit('dragend', { value })
  }
}
</script>

<style lang="scss">
@import './index.scss';
</style>
