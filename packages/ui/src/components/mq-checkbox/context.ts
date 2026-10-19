import type { ComputedRef, InjectionKey } from 'vue'
import type { MqOptionValue } from '../../utils/model'
import type { MqCheckboxType } from './types'

export interface MqCheckboxGroupContext {
  disabled: ComputedRef<boolean>
  readonly: ComputedRef<boolean>
  type: ComputedRef<MqCheckboxType>
  placement: ComputedRef<'left' | 'right'>
  checkedColor: ComputedRef<string>
  uncheckedColor: ComputedRef<string>
  isChecked: (name: MqOptionValue) => boolean
  toggle: (name: MqOptionValue) => void
}

export const checkboxGroupKey: InjectionKey<MqCheckboxGroupContext> = Symbol('mq-checkbox-group')
