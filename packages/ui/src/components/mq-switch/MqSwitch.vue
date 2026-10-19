<template>
  <view
    class="mq-switch"
    :class="[
      `mq-switch--${shape}`,
      {
        'is-on': checked,
        'is-disabled': inactive,
        'is-loading': loading,
        'has-text': Boolean(caption),
      },
    ]"
    :style="rootStyle"
    role="switch"
    :aria-checked="checked ? 'true' : 'false'"
    :aria-disabled="inactive ? 'true' : undefined"
    :aria-busy="loading ? 'true' : undefined"
    @click.stop="onClick"
  >
    <text v-if="caption" class="mq-switch__text">{{ caption }}</text>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { nextSwitchValue, resolvePx } from '../../utils/model'
import type { MqSwitchEmits, MqSwitchProps } from './types'

defineOptions({
  name: 'mq-switch',
})

const props = withDefaults(defineProps<MqSwitchProps>(), {
  modelValue: false,
  disabled: false,
  loading: false,
  activeValue: true,
  inactiveValue: false,
  activeText: '',
  inactiveText: '',
  shape: 'round',
})

const emit = defineEmits<MqSwitchEmits>()
const pending = ref(false)

const checked = computed(() => props.modelValue === props.activeValue)
const inactive = computed(() => props.disabled || props.loading || pending.value)
const caption = computed(() => (checked.value ? props.activeText : props.inactiveText))

const rootStyle = computed(() => {
  const height = resolvePx(props.size, 26)
  const thumb = Math.max(height - 4, 8)
  const textExtra = caption.value ? 18 : 0
  const width = Math.round(height * 1.75) + textExtra
  const style: Record<string, string> = {
    height: `${height}px`,
    width: `${width}px`,
    '--mq-switch-thumb': `${thumb}px`,
    '--mq-switch-shift': `${width - thumb - 4}px`,
  }
  if (props.activeColor) {
    style['--mq-switch-on'] = props.activeColor
  }
  if (props.inactiveColor) {
    style['--mq-switch-off'] = props.inactiveColor
  }
  return style
})

async function onClick() {
  if (props.disabled || props.loading || pending.value) {
    return
  }
  const next = nextSwitchValue(props.modelValue, props.activeValue, props.inactiveValue)
  if (props.beforeChange) {
    pending.value = true
    try {
      const allowed = await props.beforeChange(next)
      if (allowed === false) {
        return
      }
    } catch {
      return
    } finally {
      pending.value = false
    }
  }
  if (props.disabled || props.loading) {
    return
  }
  emit('update:modelValue', next)
  emit('change', { value: next })
}
</script>

<style lang="scss">
@import './index.scss';
</style>
