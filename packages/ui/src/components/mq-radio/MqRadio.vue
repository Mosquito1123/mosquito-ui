<template>
  <view
    class="mq-radio"
    :class="[
      `mq-radio--${mergedType}`,
      {
        'is-checked': checked,
        'is-disabled': mergedDisabled,
        'is-placement-right': mergedPlacement === 'right' && mergedType !== 'button',
      },
    ]"
    :style="rootStyle"
    role="radio"
    :aria-checked="checked ? 'true' : 'false'"
    :aria-disabled="mergedDisabled ? 'true' : undefined"
    @click.stop="onClick"
    @keydown.enter.prevent="onClick"
    @keydown.space.prevent="onClick"
  >
    <text class="mq-radio__label"><slot /></text>
  </view>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { radioGroupKey } from './context'
import type { MqRadioProps } from './types'

defineOptions({
  name: 'mq-radio',
})

const props = defineProps<MqRadioProps>()
const group = inject(radioGroupKey, null)

const mergedType = computed(() => props.type ?? group?.type.value ?? 'circle')
const mergedDisabled = computed(() => props.disabled ?? group?.disabled.value ?? false)
const mergedReadonly = computed(() => props.readonly ?? group?.readonly.value ?? false)
const mergedPlacement = computed(() => props.placement ?? group?.placement.value ?? 'left')
const checked = computed(() => group != null && props.value !== undefined && group.current.value === props.value)

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

function onClick() {
  if (!group || props.value === undefined || mergedDisabled.value || mergedReadonly.value) {
    return
  }
  group.select(props.value)
}
</script>

<style lang="scss">
@import './index.scss';
</style>
