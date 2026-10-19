export type MqCollapseBeforeExpand = (expanded: boolean) => boolean | Promise<boolean | void> | void

export interface MqCollapseItemProps {
  name?: string
  title?: string
  /** 不传时跟随折叠组。 */
  disabled?: boolean
  /** 返回 `false` 或抛错时不切换。参数是即将变成的展开状态。 */
  beforeExpand?: MqCollapseBeforeExpand
}
