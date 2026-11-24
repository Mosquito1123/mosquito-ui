# useCountDown 倒计时

## 何时使用

需要在逻辑层拿到倒计时读数、格式化文本和控制能力（开始/暂停/重置/改时长）时。解析与格式化复用 `utils/model.ts` 的 `parseTimeData` / `formatCountDown`。

## 示例

```ts
import { useCountDown } from '@mosquito/ui/composables'

const timer = useCountDown({
  time: 60_000,
  format: 'mm:ss.SSS',
  millisecond: true,
  onFinish: () => console.log('时间到'),
})

timer.current.value.seconds // 当前秒数（MqTimeData）
timer.formatted.value // '01:00.000'

timer.pause()
timer.start()
timer.update(30_000) // 换成 30 秒并保持运行
timer.update() // 按时间戳强制刷新一次
timer.reset() // 回到总时长，按 autoStart 决定是否继续
```

```vue
<text>{{ timer.formatted }}</text>
```

## API

`useCountDown(options?: UseCountDownOptions): UseCountDownReturn`

| 字段              | 类型                      | 说明                                                               |
| ----------------- | ------------------------- | ------------------------------------------------------------------ |
| `current`         | `ComputedRef<MqTimeData>` | `{ total, days, hours, minutes, seconds, milliseconds }`           |
| `formatted`       | `ComputedRef<string>`     | `formatCountDown(remain, format)` 的结果                           |
| `start` / `pause` | `() => void`              | 开始/暂停；暂停会保留剩余时间，继续时不会从头开始                  |
| `reset`           | `() => void`              | 回到总时长；`autoStart` 为 true 时自动重新开始                     |
| `update`          | `(time?: number) => void` | 传数字则更换总时长并回到该值（运行中保持运行）；不传则强制刷新一次 |
| `isRunning`       | `Ref<boolean>`            | 是否正在计时                                                       |

`UseCountDownOptions`：`time`（默认 0，毫秒）、`format`（默认 `HH:mm:ss`）、`autoStart`（默认 true）、`millisecond`（默认 false）、`onFinish`。

## 注意

- 优先用 `requestAnimationFrame` 驱动，不可用时回退 `setInterval`（毫秒模式 30ms，其余 250ms）；jsdom/测试环境可删掉 `requestAnimationFrame` 强制走回退分支。
- 时间基于 `Date.now()` 的截止时间计算，不靠累加次数，页面被挂起后恢复也能得到正确剩余时间。
- `onFinish` 每次归零触发一次；`pause()` 不会触发它。
- `millisecond: true` 时若 `format` 不含 `S` / `SS` / `SSS`，格式化文本看不到毫秒。
- 在组件 `setup` 中调用时，作用域销毁会自动停止定时器；在组件外调用需自行 `pause()`。
