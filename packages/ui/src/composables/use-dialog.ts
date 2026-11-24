import { computed, ref, type ComputedRef, type Ref } from 'vue'
import type { MqDialogBeforeConfirm, MqDialogProps } from '../components/mq-dialog/types'

/** 对话框的可配置项。`modelValue` 由 composable 自己管理，不对外开放。 */
export type UseDialogOptions = Omit<MqDialogProps, 'modelValue'>

export interface UseDialogReturn {
  /** 受控的显隐状态，可直接 `v-model` 到 `MqDialog`。 */
  visible: Ref<boolean>
  /** 当前生效的配置（每次 `show()` 都会生成新对象）。 */
  options: Ref<UseDialogOptions>
  title: ComputedRef<string>
  message: ComputedRef<string>
  show: (options?: UseDialogOptions) => void
  /** 异步确认：等 `beforeConfirm` 通过后才关闭；被拦截时保持打开并返回 false。 */
  confirm: () => Promise<boolean>
  cancel: () => void
  /** 无条件关闭，不触发 `beforeConfirm`。 */
  close: () => void
  /** 可在运行时替换的确认前钩子，与 `options.value.beforeConfirm` 同步。 */
  beforeConfirm: Ref<MqDialogBeforeConfirm | undefined>
}

/**
 * 管理一个对话框的受控状态，不修改 `MqDialog` 组件本身。
 */
export function useDialog(options: UseDialogOptions = {}): UseDialogReturn {
  const defaults: UseDialogOptions = { ...options }
  const visible = ref(false)
  const current = ref<UseDialogOptions>({ ...defaults })
  const beforeConfirm = ref<MqDialogBeforeConfirm | undefined>(defaults.beforeConfirm)
  const title = computed(() => current.value.title ?? '')
  const message = computed(() => current.value.message ?? '')

  // 上一次 confirm 等待期间若被调用过 cancel/close/show，则放弃这次关闭。
  let serial = 0

  function show(next: UseDialogOptions = {}) {
    serial += 1
    const merged: UseDialogOptions = { ...defaults, ...next }
    current.value = merged
    beforeConfirm.value = merged.beforeConfirm
    visible.value = true
  }

  async function confirm(): Promise<boolean> {
    if (!visible.value) {
      return false
    }
    const id = ++serial
    const guard = beforeConfirm.value
    try {
      if (guard) {
        const allowed = await guard()
        if (allowed === false) {
          return false
        }
      }
    } catch {
      return false
    }
    if (id !== serial || !visible.value) {
      return false
    }
    visible.value = false
    return true
  }

  function cancel() {
    serial += 1
    visible.value = false
  }

  function close() {
    serial += 1
    visible.value = false
  }

  return {
    visible,
    options: current,
    title,
    message,
    show,
    confirm,
    cancel,
    close,
    beforeConfirm,
  }
}
