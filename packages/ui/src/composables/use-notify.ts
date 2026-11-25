import type {
  MqNotifyCloser,
  MqNotifyInput,
  MqNotifyOptions,
  MqNotifyState,
  MqNotifyType,
} from '../components/mq-notify/types'
import { hideNotify, notifyState, showNotify } from '../utils/notify'

/** 可在 `useNotify()` 里预设的选项。文案由每次调用传入。 */
export type UseNotifyPreset = Omit<MqNotifyOptions, 'message'>

export interface UseNotifyReturn {
  /** 与 `notifyState` 是同一个响应式对象（全局单例）。 */
  state: MqNotifyState
  show: (input: MqNotifyInput) => MqNotifyCloser
  hide: () => void
  primary: (message: string, options?: UseNotifyPreset) => MqNotifyCloser
  success: (message: string, options?: UseNotifyPreset) => MqNotifyCloser
  warning: (message: string, options?: UseNotifyPreset) => MqNotifyCloser
  /** `error` 对应底层的 `danger` 类型。 */
  error: (message: string, options?: UseNotifyPreset) => MqNotifyCloser
}

/**
 * `showNotify` 的语法糖。预设只作用于当前实例，显示状态仍是全局唯一的（后一条覆盖前一条）。
 */
export function useNotify(options: UseNotifyPreset = {}): UseNotifyReturn {
  const preset: UseNotifyPreset = { ...options }

  function merge(input: MqNotifyInput, type?: MqNotifyType): MqNotifyOptions {
    const base: MqNotifyOptions = typeof input === 'string' ? { message: input } : input
    return {
      message: base.message,
      type: type ?? base.type ?? preset.type,
      position: base.position ?? preset.position,
      duration: base.duration ?? preset.duration,
      color: base.color ?? preset.color,
      background: base.background ?? preset.background,
      closable: base.closable ?? preset.closable,
    }
  }

  function show(input: MqNotifyInput): MqNotifyCloser {
    return showNotify(merge(input))
  }

  function byType(message: string, type: MqNotifyType, override?: UseNotifyPreset): MqNotifyCloser {
    return showNotify(merge({ ...preset, ...override, message, type }))
  }

  return {
    state: notifyState,
    show,
    hide: hideNotify,
    primary: (message, override) => byType(message, 'primary', override),
    success: (message, override) => byType(message, 'success', override),
    warning: (message, override) => byType(message, 'warning', override),
    error: (message, override) => byType(message, 'danger', override),
  }
}
