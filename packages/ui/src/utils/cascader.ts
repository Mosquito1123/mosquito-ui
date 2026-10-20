/** 级联选择的纯计算：找路径、维护每级选项、决定下一个选中值。 */

export interface MqCascaderOption {
  value: string | number
  text: string
  children?: MqCascaderOption[]
  disabled?: boolean
  tip?: string
  isLeaf?: boolean
}

function isSameValue(a: string | number, b: string | number): boolean {
  return String(a) === String(b)
}

/** 深度优先找出目标值所在的完整路径（含自身）。找不到时返回空数组。 */
export function findCascaderPath(
  options: readonly MqCascaderOption[],
  value: string | number | null | undefined,
  path: MqCascaderOption[] = [],
): MqCascaderOption[] {
  if (value === null || value === undefined || value === '') {
    return []
  }
  for (const option of options) {
    const next = [...path, option]
    if (isSameValue(option.value, value)) {
      return next
    }
    if (option.children?.length) {
      const found = findCascaderPath(option.children, value, next)
      if (found.length) {
        return found
      }
    }
  }
  return []
}

/** 按路径值数组回显，逐级匹配。 */
export function findCascaderPathByValues(
  options: readonly MqCascaderOption[],
  values: readonly (string | number)[],
): MqCascaderOption[] {
  const path: MqCascaderOption[] = []
  let level = options
  for (const value of values) {
    const option = level.find((item) => isSameValue(item.value, value))
    if (!option) {
      break
    }
    path.push(option)
    level = option.children ?? []
  }
  return path
}

/** 当前路径展开出的每一级选项。 */
export function cascaderLevels(
  options: readonly MqCascaderOption[],
  path: readonly MqCascaderOption[],
): MqCascaderOption[][] {
  const levels: MqCascaderOption[][] = [options as MqCascaderOption[]]
  let level = options
  for (const selected of path) {
    const option = level.find((item) => isSameValue(item.value, selected.value))
    if (!option?.children?.length) {
      break
    }
    levels.push(option.children)
    level = option.children
  }
  return levels
}

export function canSelectCascaderOption(option: MqCascaderOption, checkStrictly = false): boolean {
  if (option.disabled) {
    return false
  }
  return checkStrictly || option.isLeaf === true || !option.children?.length
}

/** 点击某个选项后的新路径与激活层级。 */
export function selectCascaderOption(
  path: readonly MqCascaderOption[],
  activeIndex: number,
  option: MqCascaderOption,
  checkStrictly = false,
): { path: MqCascaderOption[]; activeIndex: number } {
  const next = [...path.slice(0, Math.max(0, activeIndex)), option]
  const expandable = Boolean(option.children?.length) && option.isLeaf !== true
  if (expandable) {
    return { path: next, activeIndex: next.length }
  }
  return { path: next, activeIndex: Math.max(0, next.length - 1) }
}

/** 确认时对外返回的值：默认取最后一级的值。 */
export function cascaderValue(path: readonly MqCascaderOption[]): string | number | undefined {
  const last = path[path.length - 1]
  return last ? last.value : undefined
}

/** 确认前的合法性：路径最后一项必须可选。 */
export function isCascaderComplete(
  path: readonly MqCascaderOption[],
  checkStrictly = false,
): boolean {
  const last = path[path.length - 1]
  if (!last) {
    return false
  }
  return canSelectCascaderOption(last, checkStrictly)
}

export function cascaderLabel(path: readonly MqCascaderOption[]): string {
  return path.map((item) => item.text).join(' / ')
}
