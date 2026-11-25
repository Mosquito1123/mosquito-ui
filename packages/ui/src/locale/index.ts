import { reactive } from 'vue'
import { enUS } from './en-US'
import { zhCN } from './zh-CN'
import type {
  MqLocaleMessages,
  MqLocaleState,
  MqMessageInput,
  MqMessageMap,
  MqTranslate,
  MqTranslateParams,
} from './types'

export { enUS } from './en-US'
export { zhCN } from './zh-CN'
export type {
  MqLocaleMessages,
  MqLocaleState,
  MqMessageInput,
  MqMessageMap,
  MqTranslate,
  MqTranslateParams,
  UseLocaleReturn,
} from './types'

/** 默认语言与兜底语言。 */
export const DEFAULT_LOCALE = 'zh-CN'
export const FALLBACK_LOCALE = 'zh-CN'

/** 模块级单例状态：切换语言后所有组件同时更新，卸载组件不会回滚。 */
export const localeState = reactive<MqLocaleState>({
  locale: DEFAULT_LOCALE,
  messages: {
    'zh-CN': { ...zhCN },
    'en-US': { ...enUS },
  },
})

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

/** 把嵌套语言包摊平成点路径，使 `addMessages('zh-CN', { common: { confirm: 'OK' } })` 也能覆盖 `common.confirm`。 */
function flattenMessages(input: MqMessageInput, prefix = '', target: MqMessageMap = {}): MqMessageMap {
  for (const [key, value] of Object.entries(input)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (isRecord(value)) {
      flattenMessages(value as MqMessageInput, path, target)
    } else {
      target[path] = String(value)
    }
  }
  return target
}

/** 合并语言包：按叶子键合并，保留未覆盖的原有条目。 */
function mergeMessages(current: MqMessageMap | undefined, incoming: MqMessageInput): MqMessageMap {
  return { ...(current ?? {}), ...flattenMessages(incoming) }
}

function lookup(locale: string, key: string): string | undefined {
  const table: MqMessageMap | undefined = localeState.messages[locale]
  if (!table) {
    return undefined
  }
  if (Object.prototype.hasOwnProperty.call(table, key)) {
    return table[key]
  }
  // 同时支持真正的嵌套对象：按点路径逐段查找。
  let cursor: unknown = table
  for (const part of key.split('.')) {
    if (!isRecord(cursor) || !Object.prototype.hasOwnProperty.call(cursor, part)) {
      return undefined
    }
    cursor = cursor[part]
  }
  return typeof cursor === 'string' ? cursor : undefined
}

/** 替换 `{{name}}` 占位符；未提供的参数保持原样，便于排查遗漏。 */
function interpolate(message: string, params?: MqTranslateParams): string {
  if (!params) {
    return message
  }
  return message.replace(/\{\{\s*([^{}\s]+)\s*\}\}/g, (match, name: string) => {
    const value = params[name]
    return value === undefined ? match : String(value)
  })
}

/** 翻译文案。当前语言缺失时回退 zh-CN，仍缺失时返回 key。 */
export const t: MqTranslate = (key, params) => {
  const name = String(key ?? '')
  const message = lookup(localeState.locale, name) ?? lookup(FALLBACK_LOCALE, name) ?? name
  return interpolate(message, params)
}

/** 切换语言，可选同时补充/覆盖该语言的文案。 */
export function setLocale(locale: string, messages?: MqMessageInput): void {
  const name = String(locale ?? '').trim() || DEFAULT_LOCALE
  const next: MqLocaleMessages = localeState.messages
  if (messages) {
    const merged = mergeMessages(next[name], messages)
    localeState.messages = { ...next, [name]: merged }
  }
  localeState.locale = name
}

/** 为指定语言追加或覆盖文案，不改变当前语言。 */
export function addMessages(locale: string, messages: MqMessageInput): void {
  const name = String(locale ?? '').trim() || DEFAULT_LOCALE
  const next: MqLocaleMessages = localeState.messages
  localeState.messages = { ...next, [name]: mergeMessages(next[name], messages) }
}
