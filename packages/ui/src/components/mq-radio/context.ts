import type { ComputedRef, InjectionKey } from 'vue'
import type { MqOptionValue } from '../../utils/model'
import type { MqRadioType } from './types'

export interface MqRadioGroupContext {
  current: ComputedRef<MqOptionValue | undefined>
  disabled: ComputedRef<boolean>
  readonly: ComputedRef<boolean>
  type: ComputedRef<MqRadioType>
  placement: ComputedRef<'left' | 'right'>
  checkedColor: ComputedRef<string>
  uncheckedColor: ComputedRef<string>
  allowUncheck: ComputedRef<boolean>
  select: (value: MqOptionValue) => void
}

export const radioGroupKey: InjectionKey<MqRadioGroupContext> = Symbol('mq-radio-group')
