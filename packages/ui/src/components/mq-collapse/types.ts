export type MqCollapseModel = string | string[]

export interface MqCollapseProps {
  modelValue?: MqCollapseModel
  /** 为 true 时 `v-model` 是当前打开项的名字，关闭时为空字符串。 */
  accordion?: boolean
  disabled?: boolean
}

export interface MqCollapseEmits {
  'update:modelValue': [value: MqCollapseModel]
  change: [payload: { value: MqCollapseModel }]
}
