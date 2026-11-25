<template>
  <mq-dialog
    :model-value="visible"
    :title="title"
    :show-cancel="showCancel"
    :cancel-text="options.cancelButtonText"
    :confirm-text="options.confirmButtonText"
    :mask-closable="maskClosable"
    :z-index="options.zIndex"
    :before-confirm="beforeConfirm"
    @update:model-value="onDialogVisible"
    @confirm="onConfirm"
    @cancel="onCancel"
  >
    <view class="mq-message-box__body">
      <text v-if="message" class="mq-message-box__msg">{{ message }}</text>
      <view v-if="isPrompt" class="mq-message-box__input-wrap">
        <input
          class="mq-message-box__input"
          :type="inputType"
          :value="inputValue"
          :placeholder="placeholder"
          @input="onInput"
        />
        <text v-if="inputError" class="mq-message-box__error" role="alert">{{ inputError }}</text>
      </view>
    </view>
  </mq-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { t } from '../../locale'
import { currentMessageBox, settleMessageBox } from '../../utils/message-box'
import MqDialog from '../mq-dialog/MqDialog.vue'
import type { MqMessageBoxEmits, MqMessageBoxProps, MqMessageBoxRequest } from './types'

defineOptions({
  name: 'mq-message-box',
})

const props = withDefaults(defineProps<MqMessageBoxProps>(), {
  selector: '',
})

const emit = defineEmits<MqMessageBoxEmits>()

const current = computed(() => currentMessageBox(props.selector))
const options = computed(() => current.value?.options ?? {})
const visible = computed(() => !!current.value)
const title = computed(() => options.value.title?.trim() ?? '')
const message = computed(() => options.value.msg ?? '')
const isPrompt = computed(() => options.value.type === 'prompt')
const showCancel = computed(() => options.value.type !== 'alert')
const maskClosable = computed(() => options.value.closeOnClickModal ?? true)
const inputType = computed(() => options.value.inputType ?? 'text')
const placeholder = computed(() => options.value.inputPlaceholder || t('messageBox.inputPlaceholder'))

const inputValue = ref('')
const inputError = ref('')
let settling = false

watch(
  () => current.value?.id,
  () => {
    inputValue.value = String(options.value.inputValue ?? '')
    inputError.value = ''
  },
  { immediate: true },
)

function onInput(event: Event) {
  inputValue.value = (event.target as HTMLInputElement)?.value ?? ''
  inputError.value = ''
}

async function beforeConfirm(): Promise<boolean> {
  inputError.value = ''

  if (isPrompt.value) {
    const pattern = options.value.inputPattern
    if (pattern && !pattern.test(inputValue.value)) {
      inputError.value = options.value.inputError || t('messageBox.inputError')
      return false
    }
    const validate = options.value.inputValidate
    if (validate) {
      let ok: boolean
      try {
        ok = await validate(inputValue.value)
      } catch {
        ok = false
      }
      if (!ok) {
        inputError.value = options.value.inputError || t('messageBox.inputError')
        return false
      }
    }
  }

  const hook = options.value.beforeConfirm
  if (!hook) {
    return true
  }
  return new Promise<boolean>((resolve) => {
    let done = false
    const finish = (ok: boolean) => {
      if (done) {
        return
      }
      done = true
      resolve(ok !== false)
    }
    try {
      hook({ resolve: finish })
    } catch {
      finish(false)
    }
  })
}

function settle(action: 'confirm' | 'cancel' | 'modal') {
  const request: MqMessageBoxRequest | undefined = current.value
  if (!request) {
    return
  }
  settling = true
  if (action === 'confirm') {
    emit('confirm', request)
  } else if (action === 'cancel') {
    emit('cancel', request)
  }
  settleMessageBox(props.selector, action, isPrompt.value ? inputValue.value : undefined)
  void Promise.resolve().then(() => {
    settling = false
  })
}

function onConfirm() {
  settle('confirm')
}

function onCancel() {
  settle('cancel')
}

function onDialogVisible(next: boolean) {
  if (next || settling || !maskClosable.value) {
    return
  }
  settle('modal')
}
</script>

<style lang="scss">
@import './index.scss';
</style>
