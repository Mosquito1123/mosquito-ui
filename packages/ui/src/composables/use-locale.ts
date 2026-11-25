import { toRef } from 'vue'
import { addMessages, localeState, setLocale, t } from '../locale'
import type { MqMessageInput, UseLocaleReturn } from '../locale/types'

/**
 * 访问全局国际化状态。返回的 locale / messages 是响应式引用，
 * 组件里可以直接用 `t('common.confirm')` 或基于 `locale` 的 computed。
 */
export function useLocale(): UseLocaleReturn {
  return {
    locale: toRef(localeState, 'locale'),
    t,
    setLocale,
    addMessages,
    messages: toRef(localeState, 'messages'),
  }
}

export type { MqMessageInput, UseLocaleReturn }
