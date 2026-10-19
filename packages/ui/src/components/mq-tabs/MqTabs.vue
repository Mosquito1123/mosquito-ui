<template>
  <view class="mq-tabs" :style="rootStyle">
    <view class="mq-tabs__nav" role="tablist">
      <text
        v-for="(pane, index) in panes"
        :key="`${pane.name}-${index}`"
        class="mq-tabs__item"
        :class="{ 'is-active': isActive(pane, index), 'is-disabled': pane.disabled }"
        role="tab"
        :aria-selected="isActive(pane, index) ? 'true' : 'false'"
        :aria-disabled="pane.disabled ? 'true' : undefined"
        @click.stop="select(index, pane.name, pane.disabled)"
      >
        {{ pane.title }}
      </text>
    </view>
    <view class="mq-tabs__body">
      <slot />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { tabsKey, type MqTabPane } from './context'
import type { MqTabsEmits, MqTabsProps } from './types'

defineOptions({
  name: 'mq-tabs',
})

const props = withDefaults(defineProps<MqTabsProps>(), {
  color: '',
  inactiveColor: '',
})

const emit = defineEmits<MqTabsEmits>()
const panes = ref<MqTabPane[]>([])

const active = computed(() => props.modelValue)

const rootStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.color) {
    style['--mq-tabs-on'] = props.color
  }
  if (props.inactiveColor) {
    style['--mq-tabs-off'] = props.inactiveColor
  }
  return style
})

function isActive(pane: MqTabPane, index: number) {
  if (props.modelValue === undefined || props.modelValue === '') {
    return index === 0
  }
  return props.modelValue === pane.name || props.modelValue === index
}

function select(index: number, name: string | number, disabled: boolean) {
  const payload = { index, name }
  if (disabled) {
    emit('disabled', payload)
    return
  }
  emit('click', payload)
  if (props.modelValue === name || props.modelValue === index) {
    return
  }
  emit('update:modelValue', name)
  emit('change', payload)
}

provide(tabsKey, {
  active,
  panes,
  register(pane) {
    panes.value.push(pane)
    return panes.value.length - 1
  },
  unregister(index) {
    panes.value.splice(index, 1)
  },
  update(index, pane) {
    if (index >= 0 && index < panes.value.length) {
      panes.value[index] = pane
    }
  },
  select,
})
</script>

<style lang="scss">
@import './index.scss';
</style>
