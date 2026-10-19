import { reactive } from 'vue'
import type {
  MqNotifyCloser,
  MqNotifyInput,
  MqNotifyOptions,
  MqNotifyState,
  MqNotifyType,
} from '../components/mq-notify/types'

export const notifyState = reactive<MqNotifyState>({
  visible: false,
  message: '',
  type: 'danger',
  position: 'top',
  color: '',
  background: '',
  closable: false,
})

const DEFAULT_DURATION = 3000
const TYPES: MqNotifyType[] = ['primary', 'success', 'warning', 'danger']

let serial = 0
let hideTimer: ReturnType<typeof setTimeout> | undefined

function clearHideTimer() {
  if (hideTimer !== undefined) {
    clearTimeout(hideTimer)
    hideTimer = undefined
  }
}

function resolveDuration(value: number | undefined): number {
  if (value === undefined) {
    return DEFAULT_DURATION
  }
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    return DEFAULT_DURATION
  }
  return value
}

function normalize(input: MqNotifyInput): Required<
  Pick<MqNotifyOptions, 'message' | 'type' | 'position' | 'duration' | 'color' | 'background' | 'closable'>
> | undefined {
  const options: MqNotifyOptions | undefined = typeof input === 'string' ? { message: input } : input
  if (!options || typeof options.message !== 'string') {
    return undefined
  }
  const message = options.message.trim()
  if (!message) {
    return undefined
  }
  const type = options.type && TYPES.includes(options.type) ? options.type : 'danger'
  const position = options.position === 'bottom' ? 'bottom' : 'top'
  return {
    message,
    type,
    position,
    duration: resolveDuration(options.duration),
    color: options.color?.trim() || '',
    background: options.background?.trim() || '',
    closable: Boolean(options.closable),
  }
}

/** 页面顶部或底部的通知条。需要挂 `<mq-notify />`。 */
export function showNotify(input: MqNotifyInput): MqNotifyCloser {
  const normalized = normalize(input)
  if (!normalized) {
    return () => {}
  }
  const id = ++serial
  clearHideTimer()
  notifyState.message = normalized.message
  notifyState.type = normalized.type
  notifyState.position = normalized.position
  notifyState.color = normalized.color
  notifyState.background = normalized.background
  notifyState.closable = normalized.closable
  notifyState.visible = true
  if (normalized.duration > 0) {
    hideTimer = setTimeout(() => {
      hideTimer = undefined
      if (id === serial) {
        hideNotify()
      }
    }, normalized.duration)
  }
  return () => {
    if (id === serial) {
      hideNotify()
    }
  }
}

export function hideNotify(): void {
  serial += 1
  clearHideTimer()
  notifyState.visible = false
}
