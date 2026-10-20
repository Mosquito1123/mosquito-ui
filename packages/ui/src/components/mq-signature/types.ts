export interface MqSignatureResult {
  tempFilePath: string
}

export interface MqSignatureProps {
  penColor?: string
  lineWidth?: number
  confirmText?: string
  clearText?: string
  undoText?: string
  disabled?: boolean
  height?: number | string
  width?: number | string
  backgroundColor?: string
  fileType?: 'png' | 'jpg'
  quality?: number
  exportScale?: number
  enableHistory?: boolean
}

export interface MqSignatureEmits {
  (e: 'start', event: Event): void
  (e: 'end', event: Event): void
  (e: 'signing', event: Event): void
  (e: 'confirm', result: MqSignatureResult): void
  (e: 'clear'): void
}

export interface MqSignatureExpose {
  init: (forceUpdate?: boolean) => void
  confirm: () => Promise<MqSignatureResult | undefined>
  clear: () => void
  revoke: () => void
  restore: () => void
}
