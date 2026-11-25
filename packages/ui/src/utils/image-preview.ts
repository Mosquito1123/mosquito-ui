import { reactive } from 'vue'
import type {
  MqImagePreviewCloser,
  MqImagePreviewInput,
  MqImagePreviewOptions,
  MqImagePreviewState,
} from '../components/mq-image-preview/types'

export const imagePreviewState = reactive<MqImagePreviewState>({
  visible: false,
  urls: [],
  current: 0,
  index: 0,
})

let serial = 0

/** 把任意索引收敛到 `[0, total - 1]`；无图片或非法值返回 0。 */
export function clampImageIndex(value: number | undefined, total: number): number {
  if (!Number.isFinite(total) || total <= 0) {
    return 0
  }
  const index = Math.floor(Number(value))
  if (!Number.isFinite(index)) {
    return 0
  }
  return Math.min(total - 1, Math.max(0, index))
}

function normalize(input: MqImagePreviewInput): { urls: string[]; index: number } | undefined {
  const options: MqImagePreviewOptions | undefined = Array.isArray(input) ? { urls: input } : input
  if (!options || !Array.isArray(options.urls)) {
    return undefined
  }
  const urls = options.urls.filter((url): url is string => typeof url === 'string' && url.trim() !== '')
  if (!urls.length) {
    return undefined
  }
  const raw = options.index !== undefined ? options.index : options.current
  return { urls, index: clampImageIndex(raw, urls.length) }
}

/**
 * 显示全屏图片预览。同一时间只保留最后一组，返回的函数只关闭这一组。
 * 空白地址、空数组（或过滤后为空）会被忽略且不改变当前预览。
 */
export function showImagePreview(input: MqImagePreviewInput): MqImagePreviewCloser {
  const normalized = normalize(input)
  if (!normalized) {
    return () => {}
  }

  const id = ++serial
  imagePreviewState.urls = normalized.urls
  imagePreviewState.current = normalized.index
  imagePreviewState.index = normalized.index
  imagePreviewState.visible = true

  return () => {
    if (id === serial) {
      hideImagePreview()
    }
  }
}

/** 关掉当前预览。没有正在显示的预览时也可以调用。 */
export function hideImagePreview(): void {
  serial += 1
  imagePreviewState.visible = false
}
