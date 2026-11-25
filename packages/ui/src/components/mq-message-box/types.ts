export type MqMessageBoxType = 'alert' | 'confirm' | 'prompt'

export interface MqMessageBoxOptions {
  title?: string
  msg?: string
  type?: MqMessageBoxType
  closeOnClickModal?: boolean
  inputType?: string
  inputValue?: string | number
  inputPlaceholder?: string
  inputPattern?: RegExp
  inputValidate?: (value: string) => boolean | Promise<boolean>
  inputError?: string
  confirmButtonText?: string
  cancelButtonText?: string
  zIndex?: number
  /** 确认前的异步处理，通过 `resolve(false)` 拦截关闭。 */
  beforeConfirm?: (payload: { resolve: (ok: boolean) => void }) => void
}

export type MqMessageBoxAction = 'confirm' | 'cancel' | 'modal'

export interface MqMessageBoxRequest {
  id: number
  options: MqMessageBoxOptions
  resolve: (value: unknown) => void
  reject: (reason: MqMessageBoxAction) => void
}

export interface MqMessageBoxProps {
  /** 与 `useMessage(selector)` 对应的唯一标识。 */
  selector?: string
}

export interface MqMessageBoxEmits {
  confirm: [payload: MqMessageBoxRequest]
  cancel: [payload: MqMessageBoxRequest]
  close: []
}
