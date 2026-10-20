/** 选择器的纯计算：值归一化、多选切换和本地搜索。 */

export interface MqSelectOption {
  label: string
  value: string | number
  disabled?: boolean
  [key: string]: unknown
}

export type MqSelectValue = string | number | (string | number)[] | undefined

/** 统一成数组，去掉空值和重复项。 */
export function normalizeSelectValue(value: MqSelectValue): Array<string | number> {
  const list = Array.isArray(value) ? value : value === undefined || value === null ? [] : [value]
  const unique: Array<string | number> = []
  for (const item of list) {
    if (item === '') {
      continue
    }
    if ((typeof item === 'string' || typeof item === 'number') && !unique.includes(item)) {
      unique.push(item)
    }
  }
  return unique
}

/** 单选返回单项，多选切换后返回值。 */
export function toggleSelectValue(
  values: readonly (string | number)[],
  value: string | number,
  multiple = false,
): Array<string | number> {
  if (!multiple) {
    return [value]
  }
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value]
}

/** 按文案做大小写不敏感的包含搜索。 */
export function filterSelectOptions(
  options: readonly MqSelectOption[],
  query: string,
  labelKey = 'label',
): MqSelectOption[] {
  const keyword = String(query ?? '').trim().toLowerCase()
  if (!keyword) {
    return [...options]
  }
  return options.filter((option) =>
    String(option[labelKey] ?? option.label ?? '')
      .toLowerCase()
      .includes(keyword),
  )
}

export function selectLabels(
  options: readonly MqSelectOption[],
  values: readonly (string | number)[],
): string[] {
  return values
    .map((value) => options.find((option) => String(option.value) === String(value))?.label)
    .filter((label): label is string => typeof label === 'string')
}

export function isSelectValueEqual(
  a: readonly (string | number)[],
  b: readonly (string | number)[],
): boolean {
  return a.length === b.length && a.every((value) => b.includes(value))
}
