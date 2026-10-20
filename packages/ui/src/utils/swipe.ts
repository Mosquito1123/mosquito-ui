import { closeOutside, registerOutsideCloser, type MqOutsideCloser } from './queue'

export type MqSwipeCloser = MqOutsideCloser

export function registerSwipeAction(close: MqSwipeCloser): () => void {
  return registerOutsideCloser(close)
}

/** @deprecated 请优先使用 closeOutside；行为相同。 */
export function closeSwipeActions() {
  closeOutside()
}
