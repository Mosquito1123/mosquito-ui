<template>
  <view class="mq-tabbar-wrap">
    <view
      class="mq-tabbar"
      :class="{
        'is-fixed': fixed,
        'has-border': bordered,
        'is-safe': safeAreaInsetBottom,
      }"
      :style="rootStyle"
      role="tablist"
    >
      <slot />
    </view>
    <view v-if="fixed && placeholder" class="mq-tabbar__placeholder" :class="{ 'is-safe': safeAreaInsetBottom }" />
  </view>
</template>

<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { tabbarKey } from './context'
import type { MqTabbarEmits, MqTabbarProps } from './types'

defineOptions({
  name: 'mq-tabbar',
})

const props = withDefaults(defineProps<MqTabbarProps>(), {
  modelValue: 0,
  fixed: false,
  bordered: false,
  safeAreaInsetBottom: false,
  placeholder: false,
  activeColor: '',
  inactiveColor: '',
})

const emit = defineEmits<MqTabbarEmits>()
const pending = ref(false)
let serial = 0

const rootStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.activeColor) {
    style['--mq-tabbar-on'] = props.activeColor
  }
  if (props.inactiveColor) {
    style['--mq-tabbar-off'] = props.inactiveColor
  }
  if (props.zIndex !== undefined && Number.isFinite(props.zIndex)) {
    style.zIndex = String(props.zIndex)
  }
  return style
})

async function select(value: string | number) {
  if (pending.value || value === props.modelValue) {
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
  emit('update:modelValue', value)
  emit('change', { value })
}

provide(tabbarKey, {
  active: computed(() => props.modelValue),
  activeColor: computed(() => props.activeColor),
  inactiveColor: computed(() => props.inactiveColor),
  claim: () => serial++,
  select,
})
</script>

<style lang="scss">
@import './index.scss';
</style>
