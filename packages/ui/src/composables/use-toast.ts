import type { MqToastCloser, MqToastInput, MqToastOptions, MqToastState } from '../components/mq-toast/types'
import { hideToast, showToast, toastState } from '../utils/toast'

/** 可在 `useToast()` 里预设的选项。文案由每次调用传入。 */
export type UseToastPreset = Omit<MqToastOptions, 'message'>

export interface UseToastReturn {
  /** 与 `toastState` 是同一个响应式对象（全局单例）。 */
  state: MqToastState
  /** `state` 的别名，方便写成 `const { toasts } = useToast()`。 */
  toasts: MqToastState
  show: (input: MqToastInput) => MqToastCloser
  hide: () => void
  success: (message: string, options?: UseToastPreset) => MqToastCloser
  error: (message: string, options?: UseToastPreset) => MqToastCloser
  info: (message: string, options?: UseToastPreset) => MqToastCloser
  warning: (message: string, options?: UseToastPreset) => MqToastCloser
}

/**
 * `showToast` 的语法糖。预设只作用于当前实例，显示状态仍是全局唯一的（后一条覆盖前一条）。
 */
export function useToast(options: UseToastPreset = {}): UseToastReturn {
  const preset: UseToastPreset = { ...options }

  function merge(input: MqToastInput, override?: UseToastPreset): MqToastOptions {
    const base: MqToastOptions = typeof input === 'string' ? { message: input } : input
    return {
      message: base.message,
      duration: override?.duration ?? base.duration ?? preset.duration,
    }
  }

  function show(input: MqToastInput): MqToastCloser {
    return showToast(merge(input))
  }

  function byType(message: string, override?: UseToastPreset): MqToastCloser {
    return show({ message, duration: override?.duration ?? preset.duration })
  }

  return {
    state: toastState,
    toasts: toastState,
    show,
    hide: hideToast,
    success: (message, override) => byType(message, override),
    error: (message, override) => byType(message, override),
    info: (message, override) => byType(message, override),
    warning: (message, override) => byType(message, override),
  }
}
