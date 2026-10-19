export type MqSwipeCloser = () => void

const closers = new Set<MqSwipeCloser>()

export function registerSwipeAction(close: MqSwipeCloser): () => void {
  closers.add(close)
  return () => {
    closers.delete(close)
  }
}

/** 关闭页面上所有已展开的滑动操作。可挂在页面根节点 click 上。 */
export function closeSwipeActions() {
  for (const close of [...closers]) {
    close()
  }
}
