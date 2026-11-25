import { reactive } from 'vue'
import type {
  MqMessageBoxAction,
  MqMessageBoxOptions,
  MqMessageBoxRequest,
} from '../components/mq-message-box/types'

/**
 * 弹框请求队列。按 `selector` 隔离，页面上的 <mq-message-box /> 只消费自己那一条队列。
 * 使用 reactive 是为了让宿主的 computed 能追踪到 push / shift。
 */
const queues = reactive<Record<string, MqMessageBoxRequest[]>>({})
let serial = 0

export function showMessageBox(options: MqMessageBoxOptions, selector = ''): Promise<unknown> {
  const normalized: MqMessageBoxOptions = { ...options }
  return new Promise<unknown>((resolve, reject) => {
    serial += 1
    if (!queues[selector]) {
      queues[selector] = []
    }
    queues[selector].push({ id: serial, options: normalized, resolve, reject })
  })
}

export function currentMessageBox(selector = ''): MqMessageBoxRequest | undefined {
  return queues[selector]?.[0]
}

export function settleMessageBox(selector = '', action: MqMessageBoxAction, payload?: unknown): boolean {
  const request = currentMessageBox(selector)
  if (!request) {
    return false
  }
  queues[selector].shift()
  if (action === 'confirm') {
    request.resolve(payload)
  } else {
    request.reject(action)
  }
  return true
}

/** 直接关闭当前弹框，等价于用户点击遮罩。 */
export function closeMessageBox(selector = ''): boolean {
  return settleMessageBox(selector, 'modal')
}

/** 测试用：清空所有队列，避免跨用例串扰。 */
export function resetMessageBoxes(): void {
  for (const key of Object.keys(queues)) {
    delete queues[key]
  }
}
