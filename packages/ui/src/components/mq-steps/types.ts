export interface MqStepsProps {
  /** 当前步骤，从 0 开始。之前的步骤视为完成。 */
  active?: number
  vertical?: boolean
  dot?: boolean
  alignCenter?: boolean
}
