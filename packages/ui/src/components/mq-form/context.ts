import type { ComputedRef, InjectionKey, Ref } from 'vue'
import type {
  MqFormAsteriskPosition,
  MqFormErrorType,
  MqFormLayout,
  MqFormSchema,
  MqFormValueAlign,
} from './types'

export interface MqFormContext {
  model: ComputedRef<Record<string, unknown>>
  schema: ComputedRef<MqFormSchema | undefined>
  errorType: ComputedRef<MqFormErrorType>
  disabled: ComputedRef<boolean>
  border: ComputedRef<boolean>
  center: ComputedRef<boolean>
  titleWidth: ComputedRef<string | number | undefined>
  layout: ComputedRef<MqFormLayout>
  valueAlign: ComputedRef<MqFormValueAlign>
  asteriskPosition: ComputedRef<MqFormAsteriskPosition>
  hideAsterisk: ComputedRef<boolean>
  errors: Ref<Record<string, string>>
  clearError: (prop?: string) => void
  setError: (prop: string, message: string) => void
}

export const formKey: InjectionKey<MqFormContext> = Symbol('mq-form')
