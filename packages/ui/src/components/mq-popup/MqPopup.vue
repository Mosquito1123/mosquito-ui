<template>
  <view
    v-if="rendered"
    class="mq-popup"
    :class="[`mq-popup--${position}`, { 'is-open': opened }]"
    :style="rootStyle"
    role="dialog"
    aria-modal="true"
    :aria-label="dialogLabel"
    @click="onMask"
  >
    <view class="mq-popup__panel" @click.stop>
      <slot />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import type { MqPopupEmits, MqPopupProps } from './types'

defineOptions({
  name: 'mq-popup',
})

const props = withDefaults(defineProps<MqPopupProps>(), {
  modelValue: false,
  position: 'center',
  maskClosable: true,
  duration: 200,
  title: '',
})

const emit = defineEmits<MqPopupEmits>()

const rendered = ref(false)
const opened = ref(false)
let leaveTimer: ReturnType<typeof setTimeout> | undefined
let escapeBound = false

const durationMs = computed(() => {
  const value = props.duration
  if (!Number.isFinite(value) || value < 0) {
    return 200
  }
  return value
})

const dialogLabel = computed(() => {
  const title = props.title.trim()
  return title || undefined
})

const rootStyle = computed(() => {
  const style: Record<string, string> = {
    '--mq-popup-duration': `${durationMs.value}ms`,
  }
  if (props.zIndex !== undefined && Number.isFinite(props.zIndex)) {
    style.zIndex = String(props.zIndex)
  }
  return style
})

function clearLeave() {
  if (leaveTimer !== undefined) {
    clearTimeout(leaveTimer)
    leaveTimer = undefined
  }
}

function onEscape(event: KeyboardEvent) {
  if (event.key !== 'Escape' || !props.maskClosable || !props.modelValue) {
    return
  }
  event.preventDefault()
  requestClose()
}

function bindEscape() {
  if (escapeBound || typeof window === 'undefined') {
    return
  }
  escapeBound = true
  window.addEventListener('keydown', onEscape)
}

function unbindEscape() {
  if (!escapeBound || typeof window === 'undefined') {
    return
  }
  escapeBound = false
  window.removeEventListener('keydown', onEscape)
}

watch(
  () => props.modelValue,
  async (visible) => {
    if (visible) {
      clearLeave()
      rendered.value = true
      emit('open')
      await nextTick()
      if (!props.modelValue) {
        return
      }
      opened.value = true
      bindEscape()
      return
    }

    opened.value = false
    unbindEscape()
    if (!rendered.value) {
      return
    }
    clearLeave()
    leaveTimer = setTimeout(() => {
      rendered.value = false
      leaveTimer = undefined
    }, durationMs.value)
    emit('close')
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  clearLeave()
  unbindEscape()
})

function requestClose() {
  if (!props.modelValue) {
    return
  }
  emit('update:modelValue', false)
}

function onMask() {
  if (!props.maskClosable) {
    return
  }
  requestClose()
}
</script>

<style lang="scss">
@import './index.scss';
</style>
