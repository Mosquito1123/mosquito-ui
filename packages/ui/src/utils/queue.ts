export type MqOutsideCloser = () => void

const closers = new Set<MqOutsideCloser>()

/** 注册点击页面其他区域时需要关闭的浮层（滑动操作、气泡、提示等）。 */
export function registerOutsideCloser(close: MqOutsideCloser): () => void {
  closers.add(close)
  return () => {
    closers.delete(close)
  }
}

/** 关闭页面上所有已注册的浮层。可挂在页面根节点 click 上。 */
export function closeOutside() {
  for (const close of [...closers]) {
    close()
  }
}
