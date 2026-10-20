import type { MqCascaderOption } from '../../utils/cascader'

export interface MqCascaderBeforeConfirm {
  (
    value: string | number | undefined,
    selectedOptions: MqCascaderOption[],
  ): boolean | Promise<boolean>
}

export interface MqCascaderProps {
  /** 叶子节点的值。 */
  modelValue?: string | number
  visible?: boolean
  options?: MqCascaderOption[]
  title?: string
  cancelText?: string
  confirmText?: string
  /** 任意一级都可选，不再强制选到叶子。 */
  checkStrictly?: boolean
  beforeConfirm?: MqCascaderBeforeConfirm
  maskClosable?: boolean
  zIndex?: number
  duration?: number
  safeArea?: boolean
}

export interface MqCascaderConfirmPayload {
  value: string | number | undefined
  selectedOptions: MqCascaderOption[]
}

export interface MqCascaderEmits {
  (e: 'update:modelValue', value: string | number | undefined): void
  (e: 'update:visible', visible: boolean): void
  (e: 'confirm', payload: MqCascaderConfirmPayload): void
  (e: 'cancel'): void
  (e: 'open'): void
  (e: 'close'): void
}
