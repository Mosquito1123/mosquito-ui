<template>
  <view v-if="active" class="mq-tab" role="tabpanel">
    <slot />
  </view>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { tabsKey } from '../mq-tabs/context'
import type { MqTabProps } from './types'

defineOptions({
  name: 'mq-tab',
})

const props = withDefaults(defineProps<MqTabProps>(), {
  title: '',
  disabled: false,
})

const group = inject(tabsKey, null)
const index = ref(-1)

const paneName = computed(() => (props.name === undefined || props.name === '' ? index.value : props.name))

const active = computed(() => {
  if (!group) {
    return true
  }
  const current = group.active.value
  if (current === undefined || current === '') {
    return index.value === 0
  }
  return current === paneName.value || current === index.value
})

function sync() {
  if (!group || index.value < 0) {
    return
  }
  group.update(index.value, {
    name: paneName.value,
    title: props.title,
    disabled: props.disabled,
  })
}

onMounted(() => {
  if (!group) {
    return
  }
  index.value = group.register({
    name: props.name === undefined || props.name === '' ? -1 : props.name,
    title: props.title,
    disabled: props.disabled,
  })
  sync()
})

watch(
  () => [props.title, props.name, props.disabled] as const,
  () => {
    sync()
  },
)

onBeforeUnmount(() => {
  if (group && index.value >= 0) {
    group.unregister(index.value)
  }
})
</script>

<style lang="scss">
@import './index.scss';
</style>
