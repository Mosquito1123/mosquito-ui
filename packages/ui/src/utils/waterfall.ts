/** 瀑布流分列。没有高度估算时按下标轮询，保证各列数量接近。 */

export interface MqWaterfallCell<T> {
  item: T
  index: number
}

export type MqWaterfallHeight<T> = (item: T, index: number) => number

export function splitWaterfall<T>(
  data: readonly T[],
  column = 2,
  estimateHeight?: MqWaterfallHeight<T>,
): Array<Array<MqWaterfallCell<T>>> {
  const count = Math.min(6, Math.max(1, Math.floor(Number(column)) || 1))
  const columns: Array<Array<MqWaterfallCell<T>>> = Array.from({ length: count }, () => [])
  if (!estimateHeight) {
    data.forEach((item, index) => {
      columns[index % count].push({ item, index })
    })
    return columns
  }

  const heights = new Array<number>(count).fill(0)
  data.forEach((item, index) => {
    let target = 0
    for (let cursor = 1; cursor < count; cursor += 1) {
      if (heights[cursor] < heights[target]) {
        target = cursor
      }
    }
    columns[target].push({ item, index })
    const value = Number(estimateHeight(item, index))
    heights[target] += Number.isFinite(value) && value > 0 ? value : 0
  })
  return columns
}
