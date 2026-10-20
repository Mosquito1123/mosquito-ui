/** 选择器数据归一化和选中计算。列数据、级联树和索引都在这里处理，组件只负责渲染。 */

export type MqPickerValue = string | number

export interface MqPickerOption {
  value: MqPickerValue
  label: string | number
  disabled?: boolean
  children?: MqPickerOption[]
  [key: string]: unknown
}

export type MqPickerColumn = Array<string | number | MqPickerOption>
export type MqPickerColumns = MqPickerColumn | MqPickerColumn[]

export interface MqPickerKeys {
  valueKey?: string
  labelKey?: string
  childrenKey?: string
}

export interface MqPickerSelection {
  selectedValues: MqPickerValue[]
  selectedOptions: MqPickerOption[]
  selectedLabels: string[]
  selectedIndexes: number[]
}

const DEFAULT_KEYS: Required<MqPickerKeys> = {
  valueKey: 'value',
  labelKey: 'label',
  childrenKey: 'children',
}

function resolveKeys(keys: MqPickerKeys = {}): Required<MqPickerKeys> {
  return {
    valueKey: keys.valueKey || DEFAULT_KEYS.valueKey,
    labelKey: keys.labelKey || DEFAULT_KEYS.labelKey,
    childrenKey: keys.childrenKey || DEFAULT_KEYS.childrenKey,
  }
}

export function normalizePickerOption(
  item: string | number | MqPickerOption,
  keys: MqPickerKeys = {},
): MqPickerOption {
  const { valueKey, labelKey, childrenKey } = resolveKeys(keys)
  if (typeof item === 'string' || typeof item === 'number') {
    return { value: item, label: String(item) }
  }
  const rawValue = item[valueKey]
  const rawLabel = item[labelKey]
  const value: MqPickerValue =
    typeof rawValue === 'string' || typeof rawValue === 'number'
      ? rawValue
      : typeof item.value === 'string' || typeof item.value === 'number'
        ? item.value
        : String(rawLabel ?? '')
  const label =
    typeof rawLabel === 'string' || typeof rawLabel === 'number'
      ? rawLabel
      : typeof item.label === 'string' || typeof item.label === 'number'
        ? item.label
        : String(value)
  const rawChildren = item[childrenKey]
  const children = Array.isArray(rawChildren)
    ? rawChildren.map((child) =>
        normalizePickerOption(child as string | number | MqPickerOption, keys),
      )
    : undefined
  return {
    ...item,
    value,
    label,
    disabled: Boolean(item.disabled),
    children,
  }
}

/** 单列输入。 */
export function normalizePickerColumn(
  column: MqPickerColumn | undefined,
  keys: MqPickerKeys = {},
): MqPickerOption[] {
  if (!Array.isArray(column)) {
    return []
  }
  return column.map((item) => normalizePickerOption(item, keys))
}

/** 把一维数组、二维数组统一成列数组。 */
export function normalizePickerColumns(
  input: MqPickerColumns | undefined,
  keys: MqPickerKeys = {},
): MqPickerOption[][] {
  if (!Array.isArray(input) || input.length === 0) {
    return []
  }
  if (Array.isArray(input[0])) {
    return (input as MqPickerColumn[]).map((column) => normalizePickerColumn(column, keys))
  }
  return [normalizePickerColumn(input as MqPickerColumn, keys)]
}

export function firstEnabledIndex(column: readonly MqPickerOption[]): number {
  const index = column.findIndex((item) => !item.disabled)
  return index >= 0 ? index : 0
}

export function findPickerIndex(
  column: readonly MqPickerOption[],
  value: MqPickerValue,
): number {
  return column.findIndex((item) => item.value === value)
}

/** 根据值找下标。值不存在时落到第一个可用项。 */
export function resolvePickerIndexes(
  columns: readonly MqPickerOption[][],
  values: readonly MqPickerValue[] = [],
): number[] {
  return columns.map((column, index) => {
    if (!column.length) {
      return 0
    }
    const found = index < values.length ? findPickerIndex(column, values[index]) : -1
    return found >= 0 ? found : firstEnabledIndex(column)
  })
}

export function pickerSelection(
  columns: readonly MqPickerOption[][],
  indexes: readonly number[],
): MqPickerSelection {
  const selectedValues: MqPickerValue[] = []
  const selectedOptions: MqPickerOption[] = []
  const selectedLabels: string[] = []
  const selectedIndexes: number[] = []

  columns.forEach((column, index) => {
    if (!column.length) {
      return
    }
    const raw = indexes[index]
    const current = Number.isInteger(raw) ? Math.min(column.length - 1, Math.max(0, raw as number)) : firstEnabledIndex(column)
    const option = column[current]
    selectedIndexes.push(current)
    selectedValues.push(option.value)
    selectedOptions.push(option)
    selectedLabels.push(String(option.label))
  })

  return { selectedValues, selectedOptions, selectedLabels, selectedIndexes }
}

/** 级联：按外部值展开每一级，缺省项落到第一项。 */
export function buildCascadeSelection(
  tree: MqPickerColumn | undefined,
  values: readonly MqPickerValue[] = [],
  keys: MqPickerKeys = {},
): { columns: MqPickerOption[][]; indexes: number[] } {
  const columns: MqPickerOption[][] = []
  const indexes: number[] = []
  let level = normalizePickerColumn(tree, keys)
  let cursor = 0

  while (level.length) {
    columns.push(level)
    const wanted = cursor < values.length ? values[cursor] : undefined
    const found = wanted === undefined ? -1 : findPickerIndex(level, wanted)
    const index = found >= 0 ? found : firstEnabledIndex(level)
    indexes.push(index)
    if (cursor < values.length) {
      cursor += 1
    }
    level = level[index]?.children ?? []
  }

  return { columns, indexes }
}

/** 级联：按索引链重建每一级。父级换了以后子级自动回到第一项。 */
export function cascadeColumnsFromIndexes(
  tree: MqPickerColumn | undefined,
  indexes: readonly number[] = [],
  keys: MqPickerKeys = {},
): { columns: MqPickerOption[][]; indexes: number[] } {
  const columns: MqPickerOption[][] = []
  const nextIndexes: number[] = []
  let level = normalizePickerColumn(tree, keys)

  for (let depth = 0; level.length; depth += 1) {
    columns.push(level)
    const raw = indexes[depth]
    const index = Number.isInteger(raw)
      ? Math.min(level.length - 1, Math.max(0, raw as number))
      : firstEnabledIndex(level)
    nextIndexes.push(index)
    level = level[index]?.children ?? []
  }

  return { columns, indexes: nextIndexes }
}

export function samePickerValues(
  a: readonly MqPickerValue[],
  b: readonly MqPickerValue[],
): boolean {
  return a.length === b.length && a.every((item, index) => item === b[index])
}
