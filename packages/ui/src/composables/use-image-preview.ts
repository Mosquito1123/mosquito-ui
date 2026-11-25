import type {
  MqImagePreviewCloser,
  MqImagePreviewInput,
  MqImagePreviewState,
} from '../components/mq-image-preview/types'
import { hideImagePreview, imagePreviewState, showImagePreview } from '../utils/image-preview'

export interface UseImagePreviewReturn {
  /** 与组件共享的全局 reactive 状态。 */
  state: MqImagePreviewState
  show: (input: MqImagePreviewInput) => MqImagePreviewCloser
  hide: () => void
}

/** 图片预览的命令式入口，与 `<mq-image-preview />` 共享同一份状态。 */
export function useImagePreview(): UseImagePreviewReturn {
  return {
    state: imagePreviewState,
    show: showImagePreview,
    hide: hideImagePreview,
  }
}
