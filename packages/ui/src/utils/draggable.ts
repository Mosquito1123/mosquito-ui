/** 拖拽排序的纯计算：目标下标、让位位移和重排后的列表。 */

/** 根据拖拽位移推算落点下标。 */
export function resolveDragTarget(
  from: number,
  offset: number,
  size: number,
  length: number,
): number {
  const total = Math.max(0, Math.floor(Number(length)) || 0)
  if (!total) {
    return 0
  }
  const step = Number.isFinite(size) && size > 0 ? size : 1
  const distance = Number.isFinite(offset) ? offset : 0
  const start = Math.min(total - 1, Math.max(0, Math.floor(Number(from)) || 0))
  const shift = Math.round(distance / step)
  return Math.min(total - 1, Math.max(0, start + shift))
}

/** 非拖拽项的让位位移，把空档让给拖拽项。 */
export function draggableOffset(
  from: number,
  to: number,
  index: number,
  size: number,
): number {
  const step = Number.isFinite(size) ? size : 0
  if (from === to || index === from) {
    return 0
  }
  if (from < to && index > from && index <= to) {
    return -step
  }
  if (from > to && index < from && index >= to) {
    return step
  }
  return 0
}

/** 把 from 位置的元素移动到 to 位置。 */
export function reorderList<T>(list: readonly T[], from: number, to: number): T[] {
  const next = [...list]
  const start = Math.floor(Number(from))
  const end = Math.floor(Number(to))
  if (
    start === end ||
    !Number.isFinite(start) ||
    !Number.isFinite(end) ||
    start < 0 ||
    end < 0 ||
    start >= next.length ||
    end >= next.length
  ) {
    return next
  }
  const [moved] = next.splice(start, 1)
  next.splice(end, 0, moved)
  return next
}
