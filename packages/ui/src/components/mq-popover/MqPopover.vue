<template>
  <view class="mq-popover">
    <view class="mq-popover__reference" @click.stop="onToggle">
      <slot />
    </view>
    <view v-if="modelValue" class="mq-popover__pop" :class="`is-${placement}`" @click.stop>
      <slot name="content">
        <template v-if="mode === 'menu'">
          <view
            v-for="(item, index) in menuItems"
            :key="`${item.content}-${index}`"
            class="mq-popover__item"
            :class="{ 'is-disabled': item.disabled }"
            @click.stop="onMenu(item, index)"
          >
            <text v-if="item.mark">{{ item.mark }}</text>
            <text>{{ item.content }}</text>
          </view>
        </template>
        <text v-else class="mq-popover__text">{{ textContent }}</text>
      </slot>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { registerOutsideCloser } from '../../utils/queue'
import type { MqPopoverEmits, MqPopoverMenuItem, MqPopoverProps } from './types'

defineOptions({
  name: 'mq-popover',
})

const props = withDefaults(defineProps<MqPopoverProps>(), {
  modelValue: false,
  content: '',
  placement: 'bottom',
  mode: 'normal',
  disabled: false,
})

const emit = defineEmits<MqPopoverEmits>()

const textContent = computed(() => (typeof props.content === 'string' ? props.content : ''))
const menuItems = computed<MqPopoverMenuItem[]>(() =>
  Array.isArray(props.content) ? props.content : [],
)

function setOpen(next: boolean) {
  if (props.disabled || next === props.modelValue) {
    return
  }
  emit('update:modelValue', next)
  emit('change', next)
  if (next) {
    emit('open')
  } else {
    emit('close')
  }
}

function onToggle() {
  if (props.disabled) {
    return
  }
  setOpen(!props.modelValue)
}

function onMenu(item: MqPopoverMenuItem, index: number) {
  if (item.disabled) {
    return
  }
  emit('menuclick', { item, index })
  setOpen(false)
}

let unregister: (() => void) | undefined

onMounted(() => {
  unregister = registerOutsideCloser(() => {
    setOpen(false)
  })
})

onBeforeUnmount(() => {
  unregister?.()
})
</script>

<style lang="scss">
@import './index.scss';
</style>
