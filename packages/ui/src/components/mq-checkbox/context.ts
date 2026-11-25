import type { ComputedRef, InjectionKey } from 'vue'
import type { MqOptionValue } from '../../utils/model'
import type { MqCheckboxType } from './types'

/** 子项注册信息用取值函数保存，父级批量操作时读到的是最新状态。 */
export interface MqCheckboxGroupChildState {
  name: () => MqOptionValue | undefined
  disabled: () => boolean
}

export interface MqCheckboxGroupContext {
  disabled: ComputedRef<boolean>
  readonly: ComputedRef<boolean>
  type: ComputedRef<MqCheckboxType>
  placement: ComputedRef<'left' | 'right'>
  checkedColor: ComputedRef<string>
  uncheckedColor: ComputedRef<string>
  isChecked: (name: MqOptionValue) => boolean
  toggle: (name: MqOptionValue) => void
  register: (child: MqCheckboxGroupChildState) => void
  unregister: (child: MqCheckboxGroupChildState) => void
}

export const checkboxGroupKey: InjectionKey<MqCheckboxGroupContext> = Symbol('mq-checkbox-group')
