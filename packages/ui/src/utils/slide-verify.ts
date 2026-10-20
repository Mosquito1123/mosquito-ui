/** 滑动验证的纯计算。 */

export function clampSlideDistance(distance: number, max: number): number {
  const limit = Number.isFinite(max) && max > 0 ? max : 0
  const value = Number.isFinite(distance) ? distance : 0
  return Math.min(limit, Math.max(0, value))
}

/** 0~1 的完成度。 */
export function slideProgress(distance: number, max: number): number {
  const limit = Number.isFinite(max) && max > 0 ? max : 0
  if (!limit) {
    return 0
  }
  return clampSlideDistance(distance, limit) / limit
}

export function isSlidePassed(progress: number, threshold = 0.9): boolean {
  const limit = Number.isFinite(threshold) ? Math.min(1, Math.max(0, threshold)) : 0.9
  return Number.isFinite(progress) && progress >= limit
}

/** 拖动结束后：通过就停在终点，否则回弹。 */
export function settleSlideDistance(
  distance: number,
  max: number,
  threshold = 0.9,
): { distance: number; passed: boolean } {
  const passed = isSlidePassed(slideProgress(distance, max), threshold)
  return {
    distance: passed ? clampSlideDistance(max, max) : 0,
    passed,
  }
}
