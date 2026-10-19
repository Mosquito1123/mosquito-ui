<template>
  <view class="mq-navbar-wrap">
    <view
      class="mq-navbar"
      :class="{
        'is-fixed': fixed,
        'has-border': bordered,
        'is-safe': safeAreaInsetTop,
      }"
      :style="rootStyle"
    >
      <view
        class="mq-navbar__side mq-navbar__side--left"
        :class="{ 'is-disabled': leftDisabled }"
        role="button"
        :tabindex="leftDisabled ? undefined : 0"
        @click.stop="onLeft"
        @keydown.enter.prevent="onLeft"
        @keydown.space.prevent="onLeft"
      >
        <slot name="left">
          <text v-if="leftArrow" class="mq-navbar__arrow" aria-hidden="true">‹</text>
          <text v-if="leftText" class="mq-navbar__action">{{ leftText }}</text>
        </slot>
      </view>
      <view class="mq-navbar__title">
        <slot name="title">
          <text class="mq-navbar__title-text">{{ title }}</text>
        </slot>
      </view>
      <view
        class="mq-navbar__side mq-navbar__side--right"
        :class="{ 'is-disabled': rightDisabled }"
        role="button"
        :tabindex="rightDisabled ? undefined : 0"
        @click.stop="onRight"
        @keydown.enter.prevent="onRight"
        @keydown.space.prevent="onRight"
      >
        <slot name="right">
          <text v-if="rightText" class="mq-navbar__action">{{ rightText }}</text>
        </slot>
      </view>
    </view>
    <view v-if="fixed && placeholder" class="mq-navbar__placeholder" :class="{ 'is-safe': safeAreaInsetTop }" />
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MqNavbarEmits, MqNavbarProps } from './types'

defineOptions({
  name: 'mq-navbar',
})

const props = withDefaults(defineProps<MqNavbarProps>(), {
  title: '',
  leftText: '',
  rightText: '',
  leftArrow: false,
  bordered: false,
  fixed: false,
  placeholder: false,
  safeAreaInsetTop: false,
  leftDisabled: false,
  rightDisabled: false,
})

const emit = defineEmits<MqNavbarEmits>()

const rootStyle = computed(() => {
  if (props.zIndex !== undefined && Number.isFinite(props.zIndex)) {
    return { zIndex: String(props.zIndex) }
  }
  return undefined
})

function onLeft() {
  if (props.leftDisabled) {
    return
  }
  emit('click-left')
}

function onRight() {
  if (props.rightDisabled) {
    return
  }
  emit('click-right')
}
</script>

<style lang="scss">
@import './index.scss';
</style>
