import type {
  MqVideoPreviewCloser,
  MqVideoPreviewInput,
  MqVideoPreviewState,
} from '../components/mq-video-preview/types'
import { hideVideoPreview, showVideoPreview, videoPreviewState } from '../utils/video-preview'

export interface UseVideoPreviewReturn {
  /** 与组件共享的全局 reactive 状态。 */
  state: MqVideoPreviewState
  show: (input: MqVideoPreviewInput) => MqVideoPreviewCloser
  hide: () => void
}

/** 视频预览的命令式入口，与 `<mq-video-preview />` 共享同一份状态。 */
export function useVideoPreview(): UseVideoPreviewReturn {
  return {
    state: videoPreviewState,
    show: showVideoPreview,
    hide: hideVideoPreview,
  }
}
