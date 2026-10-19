<template>
  <view class="mq-collapse-item" :class="{ 'is-open': open, 'is-disabled': inactive }">
    <view
      class="mq-collapse-item__head"
      role="button"
      :aria-expanded="open ? 'true' : 'false'"
      :aria-disabled="inactive ? 'true' : undefined"
      :tabindex="inactive ? undefined : 0"
      :hover-class="inactive ? 'none' : 'mq-collapse-item__head--pressed'"
      @click.stop="onClick"
      @keydown.enter.prevent="onClick"
      @keydown.space.prevent="onClick"
    >
      <text class="mq-collapse-item__title">{{ title }}</text>
      <text class="mq-collapse-item__arrow" aria-hidden="true" />
    </view>
    <view v-if="open" class="mq-collapse-item__body">
      <slot />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { collapseKey } from '../mq-collapse/context'
import type { MqCollapseItemProps } from './types'

defineOptions({
  name: 'mq-collapse-item',
})

const props = withDefaults(defineProps<MqCollapseItemProps>(), {
  name: '',
  title: '',
})

const group = inject(collapseKey, null)
const pending = ref(false)

const open = computed(() => (props.name ? (group?.isOpen(props.name) ?? false) : false))
const inactive = computed(() => props.disabled ?? group?.disabled.value ?? false)

async function onClick() {
  if (!group || !props.name || inactive.value || pending.value) {
    return
  }
  const nextOpen = !open.value
  if (props.beforeExpand) {
    pending.value = true
    try {
      const allowed = await props.beforeExpand(nextOpen)
      if (allowed === false) {
        return
      }
    } catch {
      return
    } finally {
      pending.value = false
    }
  }
  if (inactive.value) {
    return
  }
  group.toggle(props.name)
}
</script>

<style lang="scss">
@import './index.scss';
</style>
