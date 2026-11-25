import { closeMessageBox, showMessageBox } from '../utils/message-box'
import type { MqMessageBoxOptions, MqMessageBoxType } from '../components/mq-message-box/types'

export type UseMessageInput = string | MqMessageBoxOptions

export interface UseMessageReturn {
  /** 当前绑定的宿主标识。 */
  selector: string
  show: (input: UseMessageInput) => Promise<unknown>
  alert: (input: UseMessageInput) => Promise<void>
  confirm: (input: UseMessageInput) => Promise<void>
  prompt: (input: UseMessageInput) => Promise<string>
  close: () => void
}

function normalize(input: UseMessageInput): MqMessageBoxOptions {
  return typeof input === 'string' ? { msg: input } : { ...input }
}

/**
 * `MqMessageBox` 的命令式入口。页面里挂一个 `<mq-message-box />`，
 * 然后 `const message = useMessage()` 即可调用 alert / confirm / prompt。
 *
 * `confirm` / `prompt` 在取消或点遮罩时会 reject，参数是 `'cancel' | 'modal'`。
 */
export function useMessage(selector = ''): UseMessageReturn {
  function show(input: UseMessageInput): Promise<unknown> {
    return showMessageBox({ type: 'alert', ...normalize(input) }, selector)
  }

  function showTyped(input: UseMessageInput, type: MqMessageBoxType): Promise<unknown> {
    return showMessageBox({ ...normalize(input), type }, selector)
  }

  return {
    selector,
    show,
    alert: (input) => showTyped(input, 'alert').then(() => undefined),
    confirm: (input) => showTyped(input, 'confirm').then(() => undefined),
    prompt: (input) => showTyped(input, 'prompt').then((value) => String(value ?? '')),
    close: () => closeMessageBox(selector),
  }
}
