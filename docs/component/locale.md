# locale 国际化

## 何时使用

组件内置文案默认是简体中文。需要切换成其他语言、覆盖某条文案，或让组件文案随应用语言一起变化时，使用模块级语言状态 `localeState` 与组合式函数 `useLocale`。

无外部依赖：不引入 `vue-i18n`，只依赖 Vue 的 `reactive`。语言切换后所有已挂载组件立即更新。

## 用法示例

```ts
import { useLocale } from '@mosquito/ui/composables'
// 或按需从内部模块引入：import { t, setLocale, addMessages, localeState } from '@mosquito/ui/locale'

const { locale, t, setLocale, addMessages, messages } = useLocale()

t('common.confirm') // '确定'
t('calendar.monthTitle', { year: 2026, month: 1 }) // '2026年1月'

setLocale('en-US')
t('common.confirm') // 'Confirm'
t('calendar.monthTitle', { year: 2026, month: 1 }) // '2026/1'
locale.value // 'en-US'
```

在模板中直接使用：

```vue
<script setup lang="ts">
import { t } from '@mosquito/ui/locale'
</script>

<template>
  <view>{{ t('common.noData') }}</view>
</template>
```

通过 `MqConfigProvider` 声明应用语言（全局生效，卸载时不回滚）：

```vue
<mq-config-provider :locale="lang">
  <app />
</mq-config-provider>
```

## API

### `useLocale(): UseLocaleReturn`

| 字段          | 类型                                                                 | 说明                                             |
| ------------- | -------------------------------------------------------------------- | ------------------------------------------------ |
| `locale`      | `Ref<string>`                                                        | 当前语言标识，可读写（写操作等价于 setLocale）   |
| `t`           | `(key: string, params?: Record<string, string \| number>) => string` | 翻译文案                                         |
| `setLocale`   | `(locale: string, messages?: MqMessageInput) => void`                | 切换语言，可选同时补充/覆盖文案                  |
| `addMessages` | `(locale: string, messages: MqMessageInput) => void`                 | 合并文案到指定语言，不改变当前语言               |
| `messages`    | `Ref<MqLocaleMessages>`                                              | 全部语言包，`{ 'zh-CN': {...}, 'en-US': {...} }` |

模块级导出：`localeState`、`t`、`setLocale`、`addMessages`、`zhCN`、`enUS`、`DEFAULT_LOCALE`、`FALLBACK_LOCALE`，以及上述类型。

### 查找规则

1. 在当前语言包中查 `key`（支持 `a.b.c` 点路径，也支持嵌套对象形式的语言包）。
2. 未找到则回退到 `zh-CN`。
3. 仍未找到则返回 `key` 本身。
4. `{{name}}` 占位符用 `params` 的值替换；未提供的参数原样保留，便于排查遗漏。

### 内置 key

| key                                                              | zh-CN                       | en-US                         |
| ---------------------------------------------------------------- | --------------------------- | ----------------------------- |
| `common.cancel`                                                  | 取消                        | Cancel                        |
| `common.confirm`                                                 | 确定                        | Confirm                       |
| `common.confirmOk`                                               | 确认                        | OK                            |
| `common.close`                                                   | 关闭                        | Close                         |
| `common.done`                                                    | 完成                        | Done                          |
| `common.delete`                                                  | 删除                        | Delete                        |
| `common.search`                                                  | 搜索                        | Search                        |
| `common.loading`                                                 | 加载中                      | Loading                       |
| `common.noData`                                                  | 暂无数据                    | No data                       |
| `common.noOptions`                                               | 暂无可选项                  | No options available          |
| `common.noSelectOptions`                                         | 暂无选项                    | No options                    |
| `common.noMatch`                                                 | 没有匹配的选项              | No matching options           |
| `common.retry`                                                   | 点击重试                    | Tap to retry                  |
| `common.loadFailed`                                              | 加载失败                    | Failed to load                |
| `common.loadingMore`                                             | 正在努力加载中...           | Loading...                    |
| `common.finished`                                                | 已加载完毕                  | All loaded                    |
| `common.select`                                                  | 请选择                      | Please select                 |
| `common.chooseImage`                                             | 选图                        | Choose image                  |
| `common.rotate`                                                  | 旋转                        | Rotate                        |
| `common.reset`                                                   | 重置                        | Reset                         |
| `common.expand` / `common.collapse`                              | 展开 / 收起                 | Expand / Collapse             |
| `common.prevPage` / `common.nextPage`                            | 上一页 / 下一页             | Previous / Next               |
| `common.total`                                                   | 共 {{total}} 条             | {{total}} items in total      |
| `common.file`                                                    | 文件                        | File                          |
| `common.removeFile`                                              | 删除第 {{index}} 个文件     | Delete file {{index}}         |
| `common.moreAvatars`                                             | 还有 {{count}} 个头像       | {{count}} more avatars        |
| `common.show` / `common.hide`                                    | 显示 / 隐藏                 | Show / Hide                   |
| `common.backToTop`                                               | 回到顶部                    | Back to top                   |
| `common.rating`                                                  | 评分                        | Rating                        |
| `common.operation`                                               | 操作                        | Actions                       |
| `common.dialog`                                                  | 对话框                      | Dialog                        |
| `common.selectDate`                                              | 选择日期                    | Select date                   |
| `common.picker`                                                  | 选择器                      | Picker                        |
| `common.qrEmpty`                                                 | 二维码内容为空              | Empty QR code content         |
| `common.skip`                                                    | 跳过                        | Skip                          |
| `common.prevStep` / `common.nextStep`                            | 上一步 / 下一步             | Previous / Next               |
| `common.clear` / `common.undo` / `common.clearDate`              | 清空 / 撤销 / 清除          | Clear / Undo / Clear          |
| `common.slideHint`                                               | 按住滑块，拖动到最右侧      | Slide to the right to verify  |
| `common.slideSuccess`                                            | 验证通过                    | Verification passed           |
| `common.imageEmpty`                                              | 暂无图片                    | No image                      |
| `common.imagePreview` / `common.videoPreview`                    | 图片预览 / 视频预览         | Image preview / Video preview |
| `calendar.prevMonth` / `calendar.nextMonth`                      | 上个月 / 下个月             | Previous month / Next month   |
| `calendar.year` / `calendar.month` / `calendar.day`              | 年 / 月 / 日                | ''（无后缀）                  |
| `calendar.week`                                                  | 星期                        | Week                          |
| `calendar.monthTitle`                                            | {{year}}年{{month}}月       | {{year}}/{{month}}            |
| `calendar.selectDate`                                            | 请选择日期                  | Please select a date          |
| `calendar.selectedDays`                                          | 已选 {{count}} 天           | {{count}} days selected       |
| `calendar.rangeEnd`                                              | 结束                        | End                           |
| `calendar.weekdays.*`                                            | 日 / 一 / ... / 六          | Sun / Mon / ... / Sat         |
| `datetime.year` / `month` / `day` / `hour` / `minute` / `second` | 年 / 月 / 日 / 时 / 分 / 秒 | ''（无后缀）                  |
| `keyboard.letters` / `numbers` / `symbols`                       | 字母 / 数字 / 符号          | Letters / Numbers / Symbols   |
| `keyboard.delete` / `space` / `back`                             | 删除 / 空格 / 返回          | Delete / Space / Back         |

自定义语言包示例见 [国际化指南](../guide/i18n.md)。
