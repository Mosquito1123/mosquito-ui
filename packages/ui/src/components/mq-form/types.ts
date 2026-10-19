export interface MqFormSchemaIssue {
  path: Array<string | number>
  message: string
}

export interface MqFormSchema {
  validate: (
    model: Record<string, unknown>,
  ) => MqFormSchemaIssue[] | Promise<MqFormSchemaIssue[]>
  isRequired?: (path: string) => boolean | undefined
}

export type MqFormErrorType = 'message' | 'toast' | 'none'
export type MqFormLayout = 'horizontal' | 'vertical'
export type MqFormValueAlign = 'left' | 'right' | 'center'
export type MqFormAsteriskPosition = 'start' | 'end'

export interface MqFormProps {
  model?: Record<string, unknown>
  schema?: MqFormSchema
  errorType?: MqFormErrorType
  disabled?: boolean
  border?: boolean
  center?: boolean
  titleWidth?: string | number
  layout?: MqFormLayout
  valueAlign?: MqFormValueAlign
  asteriskPosition?: MqFormAsteriskPosition
  hideAsterisk?: boolean
  resetOnChange?: boolean
}

export interface MqFormValidateResult {
  valid: boolean
  errors: Array<{ prop: string; message: string }>
}
