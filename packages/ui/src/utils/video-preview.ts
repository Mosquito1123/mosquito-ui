import { reactive } from 'vue'
import type {
  MqVideoPreviewCloser,
  MqVideoPreviewInput,
  MqVideoPreviewOptions,
  MqVideoPreviewState,
} from '../components/mq-video-preview/types'

export const videoPreviewState = reactive<MqVideoPreviewState>({
  visible: false,
  src: '',
  title: '',
  poster: '',
})

let serial = 0

function normalize(input: MqVideoPreviewInput): Required<MqVideoPreviewOptions> | undefined {
  const options: MqVideoPreviewOptions | undefined = typeof input === 'string' ? { src: input } : input
  if (!options || typeof options.src !== 'string') {
    return undefined
  }
  const src = options.src.trim()
  if (!src) {
    return undefined
  }
  return {
    src,
    title: typeof options.title === 'string' ? options.title.trim() : '',
    poster: typeof options.poster === 'string' ? options.poster.trim() : '',
  }
}

/**
 * 显示全屏视频预览。同一时间只保留最后一个，返回的函数只关闭这一个。
 * 空白地址会被忽略且不改变当前预览。
 */
export function showVideoPreview(input: MqVideoPreviewInput): MqVideoPreviewCloser {
  const normalized = normalize(input)
  if (!normalized) {
    return () => {}
  }

  const id = ++serial
  videoPreviewState.src = normalized.src
  videoPreviewState.title = normalized.title
  videoPreviewState.poster = normalized.poster
  videoPreviewState.visible = true

  return () => {
    if (id === serial) {
      hideVideoPreview()
    }
  }
}

/** 关掉当前预览。没有正在显示的预览时也可以调用。 */
export function hideVideoPreview(): void {
  serial += 1
  videoPreviewState.visible = false
}
