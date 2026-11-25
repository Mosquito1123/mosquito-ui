# useConfigProvider 全局主题

## 何时使用

需要在任意逻辑里读写同一份主题模式（light/dark）和 CSS 变量，并拿到可直接绑到 `style` 的变量对象时。状态是模块级单例，多次调用看到的是同一份数据。

## 示例

```ts
import { useConfigProvider } from '@mosquito/ui/composables'

const theme = useConfigProvider({ theme: 'light' })

theme.setTheme('dark')
theme.setThemeVar('color-primary', '#0f3d32')
theme.setThemeVars({ '--radius': '8px', 'font-size': '14px' })

theme.theme.value // 'dark'
theme.themeVars.value // { 'color-primary': '#0f3d32', '--radius': '8px', 'font-size': '14px' }
theme.cssVars.value // { '--color-primary': '#0f3d32', '--radius': '8px', '--font-size': '14px' }

theme.reset()
```

```vue
<mq-config-provider :theme="theme.theme.value" :theme-vars="theme.cssVars.value">
  <slot />
</mq-config-provider>
```

需要直接作用于 H5 根节点时：

```ts
const theme = useConfigProvider({ applyToRoot: true })
theme.setThemeVar('--brand', '#0f3d32') // 写入 document.documentElement.style
```

## API

`useConfigProvider(options?: UseConfigProviderOptions): UseConfigProviderReturn`

| 字段           | 类型                                     | 说明                                             |
| -------------- | ---------------------------------------- | ------------------------------------------------ |
| `theme`        | `Ref<MqThemeMode>`                       | 共享的主题模式，只接受 `light` / `dark`          |
| `themeVars`    | `Ref<Record<string, string>>`            | 共享的变量表，保留调用时传入的原始键名           |
| `setTheme`     | `(theme: MqThemeMode) => void`           | 切换主题                                         |
| `setThemeVar`  | `(key: string, value: string) => void`   | 设置单个变量，空键忽略                           |
| `setThemeVars` | `(vars: Record<string, string>) => void` | 合并多个变量（同键覆盖）                         |
| `reset`        | `() => void`                             | 回到 `light`、清空变量，并移除已写入根节点的样式 |
| `cssVars`      | `ComputedRef<Record<string, string>>`    | 带 `--` 前缀的 style 对象，已有前缀不会重复添加  |

`UseConfigProviderOptions`：`theme`、`themeVars`（传入即合并进共享状态）、`applyToRoot`（默认 false）。

## 注意

- 所有实例共享同一份 `reactive` 状态；一个实例调用 `setTheme` 会影响其他实例，这是刻意设计。
- 默认不写 DOM。只有 `applyToRoot: true` 且 `isH5()` 为真、且存在 `document.documentElement` 时才应用到根节点；否则只维护响应式数据。
- `isH5()` 先读 `uni.getSystemInfoSync().platform`，不是 `h5` 就视为非 H5；读不到平台信息时才退回 `document` 是否存在。
- `themeVars` 的键不自动补前缀，`cssVars` 才补。`'--brand'` 与 `'brand'` 是两个不同的键。
- 组件 `MqConfigProvider` 仍按自己的 props 工作；本 composable 不会自动同步到已挂载的组件实例，需要把 `theme` / `cssVars` 传给它。
