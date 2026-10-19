export type MqSidebarBeforeChange = (
  value: string | number,
) => boolean | Promise<boolean | void> | void

export interface MqSidebarProps {
  modelValue?: string | number
  beforeChange?: MqSidebarBeforeChange
}

export interface MqSidebarEmits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', payload: { value: string | number; label: string }): void
}
