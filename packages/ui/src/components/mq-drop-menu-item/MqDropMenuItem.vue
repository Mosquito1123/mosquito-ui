<template>
  <view
    class="mq-drop-menu-item"
    :class="{ 'is-open': isOpen, 'is-disabled': disabled }"
    :style="isOpen ? { zIndex: String(menuZIndex) } : undefined"
  >
    <view
      class="mq-drop-menu-item__trigger"
      role="button"
      :tabindex="disabled ? undefined : 0"
      :aria-expanded="isOpen ? 'true' : 'false'"
      @click.stop="onToggle"
      @keydown.enter.prevent="onToggle"
    >
      <text class="mq-drop-menu-item__label" :class="{ 'is-active': isOpen || Boolean(selectedItem) }">
        {{ displayLabel }}
      </text>
      <text class="mq-drop-menu-item__caret" :class="{ 'is-open': isOpen }">▾</text>
    </view>

    <view
      v-if="isOpen && modal"
      class="mq-drop-menu-item__mask"
      :style="{ zIndex: String(menuZIndex - 1) }"
      @click.stop="onMask"
    />

    <view
      v-show="isOpen"
      class="mq-drop-menu-item__panel"
      :class="`is-${direction}`"
      :style="panelStyle"
      @click.stop
    >
      <scroll-view class="mq-drop-menu-item__options" scroll-y>
        <view
          v-for="option in normalizedOptions"
          :key="String(option.value)"
          class="mq-drop-menu-item__option"
          :class="{
            'is-selected': isSelected(option),
            'is-disabled': option.disabled,
          }"
          @click.stop="onSelect(option)"
        >
          <view class="mq-drop-menu-item__option-main">
            <text class="mq-drop-menu-item__option-label">{{ option.label }}</text>
            <text v-if="option.tip" class="mq-drop-menu-item__option-tip">{{ option.tip }}</text>
          </view>
          <text v-if="isSelected(option)" class="mq-drop-menu-item__check">✓</text>
        </view>
        <view v-if="!normalizedOptions.length" class="mq-drop-menu-item__empty">暂无可选项</view>
      </scroll-view>
      <slot />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref } from 'vue'
import { registerOutsideCloser } from '../../utils/queue'
import { dropMenuKey } from '../mq-drop-menu/context'
import type {
  MqDropMenuItemEmits,
  MqDropMenuItemOption,
  MqDropMenuItemProps,
} from './types'

defineOptions({
  name: 'mq-drop-menu-item',
})

const props = withDefaults(defineProps<MqDropMenuItemProps>(), {
  modelValue: undefined,
  disabled: false,
  options: () => [],
  title: '',
  placeholder: '请选择',
  valueKey: 'value',
  labelKey: 'label',
  tipKey: 'tip',
  popupHeight: '',
  beforeToggle: undefined,
})

const emit = defineEmits<MqDropMenuItemEmits>()

const menu = inject(dropMenuKey, null)
const key = Symbol('mq-drop-menu-item')
const localOpen = ref(false)

const isOpen = computed(() => (menu ? menu.activeKey.value === key : localOpen.value))
const menuZIndex = computed(() => menu?.zIndex.value ?? 12)
const menuModal = computed(() => menu?.modal.value ?? true)
const direction = computed(() => menu?.direction.value ?? 'down')
const modal = computed(() => menuModal.value)

const normalizedOptions = computed<MqDropMenuItemOption[]>(() =>
  (props.options ?? []).map((item) => ({
    ...item,
    value: item[props.valueKey] as string | number,
    label: String(item[props.labelKey] ?? ''),
    tip: item[props.tipKey] ? String(item[props.tipKey]) : '',
    disabled: Boolean(item.disabled),
  })),
)

const selectedItem = computed<MqDropMenuItemOption | undefined>(() =>
  normalizedOptions.value.find((item) => String(item.value) === String(props.modelValue)),
)

const displayLabel = computed(() => props.title || selectedItem.value?.label || props.placeholder)

const panelStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.popupHeight) {
    style.maxHeight = props.popupHeight
  }
  if (menu?.duration.value !== undefined) {
    style.transitionDuration = `${menu.duration.value}ms`
  }
  return style
})

let openedTimer: ReturnType<typeof setTimeout> | undefined
let closedTimer: ReturnType<typeof setTimeout> | undefined
let unregisterOutside: (() => void) | undefined

function clearTimers() {
  if (openedTimer !== undefined) {
    clearTimeout(openedTimer)
    openedTimer = undefined
  }
  if (closedTimer !== undefined) {
    clearTimeout(closedTimer)
    closedTimer = undefined
  }
}

function emitOpenedLater() {
  if (openedTimer !== undefined) {
    clearTimeout(openedTimer)
  }
  openedTimer = setTimeout(() => {
    openedTimer = undefined
    emit('opened')
  }, menu?.duration.value ?? 200)
}

function emitClosedLater() {
  if (closedTimer !== undefined) {
    clearTimeout(closedTimer)
  }
  closedTimer = setTimeout(() => {
    closedTimer = undefined
    emit('closed')
  }, menu?.duration.value ?? 200)
}

function setOpen(next: boolean) {
  if (props.disabled || next === isOpen.value) {
    return
  }
  if (next) {
    if (menu) {
      menu.setActive(key)
    } else {
      localOpen.value = true
    }
    emit('open')
    emitOpenedLater()
    return
  }
  if (menu) {
    menu.setActive(null)
  } else {
    localOpen.value = false
  }
  emit('close')
  emitClosedLater()
}

function onToggle() {
  if (props.disabled) {
    return
  }
  const next = !isOpen.value
  if (props.beforeToggle) {
    void Promise.resolve(props.beforeToggle({ status: next }))
      .then((allowed) => {
        if (allowed === false) {
          return
        }
        setOpen(next)
      })
      .catch(() => {
        // 拦截函数抛错时保持原状态。
      })
    return
  }
  setOpen(next)
}

function onMask() {
  if (!menu?.closeOnClickModal.value) {
    return
  }
  setOpen(false)
}

function isSelected(option: MqDropMenuItemOption): boolean {
  return String(option.value) === String(props.modelValue)
}

function onSelect(option: MqDropMenuItemOption) {
  if (option.disabled) {
    return
  }
  emit('update:modelValue', option.value as string | number)
  emit('change', { value: option.value as string | number, selectedItem: option })
  setOpen(false)
}

function getShowPop(): boolean {
  return isOpen.value
}

function open() {
  setOpen(true)
}

function close() {
  setOpen(false)
}

function toggle() {
  onToggle()
}

onMounted(() => {
  unregisterOutside = registerOutsideCloser(() => {
    if (isOpen.value) {
      setOpen(false)
    }
  })
})

onBeforeUnmount(() => {
  clearTimers()
  unregisterOutside?.()
})

defineExpose({
  getShowPop,
  open,
  close,
  toggle,
})
</script>

<style lang="scss">
@import './index.scss';
</style>
