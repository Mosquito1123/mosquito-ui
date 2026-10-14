export interface MqToastOptions {
  /** 文案。空白字符串会被忽略。 */
  message: string
  /**
   * 显示时长，毫秒。默认 2000。
   * `0` 表示不自动关闭，需要 `hideToast()`。
   * 非法或负数按默认 2000 处理。
   */
  duration?: number
}

export type MqToastInput = string | MqToastOptions

/** 只关闭对应的那一次 `showToast`。提示已被替换时调用它不会关掉新的一条。 */
export type MqToastCloser = () => void

export interface MqToastState {
  visible: boolean
  message: string
}
