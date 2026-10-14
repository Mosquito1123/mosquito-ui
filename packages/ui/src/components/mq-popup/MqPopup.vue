<template>
  <view
    v-if="rendered"
    class="mq-popup"
    :class="[`mq-popup--${position}`, { 'is-open': opened }]"
    :style="rootStyle"
    @click="onMask"
  >
    <view class="mq-popup__panel" @click.stop>
      <slot />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import type { MqPopupProps } from './types'

defineOptions({
  name: 'mq-popup',
})

const props = withDefaults(defineProps<MqPopupProps>(), {
  modelValue: false,
  position: 'center',
  maskClosable: true,
  duration: 200,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const rendered = ref(false)
const opened = ref(false)
let leaveTimer: ReturnType<typeof setTimeout> | undefined

const rootStyle = computed(() => ({
  '--mq-popup-duration': `${props.duration}ms`,
}))

function clearLeave() {
  if (leaveTimer !== undefined) {
    clearTimeout(leaveTimer)
    leaveTimer = undefined
  }
}

watch(
  () => props.modelValue,
  async (visible) => {
    if (visible) {
      clearLeave()
      rendered.value = true
      await nextTick()
      if (props.modelValue) {
        opened.value = true
      }
      return
    }
    opened.value = false
    if (!rendered.value) {
      return
    }
    clearLeave()
    leaveTimer = setTimeout(() => {
      rendered.value = false
    }, props.duration)
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  clearLeave()
})

function close() {
  emit('update:modelValue', false)
  emit('close')
}

function onMask() {
  if (props.maskClosable) {
    close()
  }
}
</script>

<style lang="scss">
@import './index.scss';
</style>
