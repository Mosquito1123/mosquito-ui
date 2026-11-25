# MqBarCode 条形码

基于 canvas 绘制的一维条码组件，内置紧凑编码器（CODE128、EAN13、EAN8、UPC-A、CODE39），无需引入第三方打包产物。非法输入通过 `valid` / `error` 事件反馈，不向调用方抛异常。

## 何时使用

- 展示商品编码（EAN13/EAN8/UPC-A）、会员卡号与物流单号（CODE128）、资产与工业标识（CODE39）等一维条码。
- 需要自动计算/校验校验位：传入不含校验位的数字即可补位，传入完整码会校验其正确性。
- 无 canvas 环境（如 jsdom）时自动降级为文字占位。

## 支持的格式与输入规则

| `format`  | 可接受输入                                                                           | 校验位规则                                                       | 模块数 |
| --------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------- | ------ |
| `CODE128` | 非空 ASCII 0–126；自动选择子集：偶数位纯数字 → C，其余可打印字符 → B，ASCII 0–95 → A | 起始符 + 数据符按权重 1, 1, 2, 3… 计算 mod 103                   | 变长   |
| `EAN13`   | 12 位数字（自动补校验位）或 13 位数字（校验已有校验位）                              | 从右往左权重 3、1 交替，`(10 - sum % 10) % 10`                   | 95     |
| `EAN8`    | 7 位数字（自动补校验位）或 8 位数字（校验已有校验位）                                | 同 EAN13 的权重规则                                              | 67     |
| `UPC-A`   | 11 位数字（自动补校验位）或 12 位数字（校验已有校验位）                              | 同 EAN13；前置 `0` 后即 EAN13，因此 bars 与补 0 后的 EAN13 一致  | 95     |
| `CODE39`  | `0-9 A-Z - . $ / + %` 与空格；可写 `*...*`，`*` 只作起止符                           | 默认无校验位；`{ mod43: true }` 时按字符值之和 mod 43 追加校验符 | 变长   |

说明：

- EAN/UPC 校验位由编码器自动处理，传入完整码时会验证末位；末位错误会触发 `error` / `valid(false)`。
- CODE39 的 43 个字符按 `0-9 A-Z - . $ / + % 空格` 顺序取值 0–42，mod43 校验符取 `sum % 43` 对应的字符。
- CODE39 每个字符由 5 条 4 空组成，其中窄元素 1 模块、宽元素 3 模块，字符间以 1 模块窄空分隔。
- 编码结果的 `text` 为实际显示文本：EAN/UPC 含校验位，UPC-A 显示 12 位（不显示前置 0），CODE39 不含 `*`。

## 示例

```vue
<template>
  <!-- 商品码：12 位自动补校验位 -->
  <mq-bar-code text="590123412345" format="EAN13" :width="240" :height="60" />

  <!-- EAN8 与 UPC-A -->
  <mq-bar-code text="9638507" format="EAN8" :width="240" />
  <mq-bar-code text="036000291452" format="UPC-A" :width="240" />

  <!-- CODE39 可带 * 起止符 -->
  <mq-bar-code text="*CODE39*" format="CODE39" :width="240" text-position="top" />

  <!-- 数字内容自动使用 CODE128C，紧凑编码 -->
  <mq-bar-code text="12345678" :width="240" line-width="2" @valid="onValid" />

  <!-- 手动重绘 -->
  <mq-bar-code ref="barRef" text="MQ-001" :display-value="true" color="#0f3d32" />
  <button @click="barRef?.draw()">重绘</button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { MqBarCodeExpose } from '@mosquito/ui'

const barRef = ref<MqBarCodeExpose>()
function onValid(valid: boolean) {
  console.log('条码内容是否合法：', valid)
}
</script>
```

## API

### Props

| 参数（属性写法） | 说明                                                                     | 类型                                                    | 默认值      |
| ---------------- | ------------------------------------------------------------------------ | ------------------------------------------------------- | ----------- |
| `text`           | 条码内容；为空或非法时发出 `error` 并显示文字占位                        | `string`                                                | `''`        |
| `format`         | 条码格式，见上表；非法输入会发出 `error`                                 | `'CODE128' \| 'EAN13' \| 'EAN8' \| 'UPC-A' \| 'CODE39'` | `'CODE128'` |
| `width`          | 画布宽度（px）；大于 0 时模块按宽度缩放，为 0 时按 `line-width` 自动计算 | `number`                                                | `0`         |
| `height`         | 画布高度（px，含文字区）                                                 | `number`                                                | `60`        |
| `line-width`     | 单个模块的基准宽度（px），仅 `width` 为 0 时生效                         | `number`                                                | `2`         |
| `display-value`  | 是否显示文字标注                                                         | `boolean`                                               | `true`      |
| `text-position`  | 文字位置                                                                 | `'top' \| 'bottom'`                                     | `'bottom'`  |
| `color`          | 条码与文字颜色                                                           | `string`                                                | `'#000000'` |
| `background`     | 背景色                                                                   | `string`                                                | `'#ffffff'` |
| `canvas-id`      | canvas 的 id，不传时自动生成                                             | `string`                                                | 自动生成    |

### Events

| 事件    | 说明                                               | 回调参数         |
| ------- | -------------------------------------------------- | ---------------- |
| `valid` | 每次绘制前发出；支持的格式且输入合法时为 `true`    | `valid: boolean` |
| `error` | 输入为空、长度/字符/校验位非法或格式不受支持时触发 | `error: Error`   |

### Slots

无。

### Methods

| 方法     | 说明                                 | 返回值 |
| -------- | ------------------------------------ | ------ |
| `draw()` | 立即重绘（修改属性后组件会自动重绘） | `void` |

## 主题变量

| 变量                  | 用途         | 回退值    |
| --------------------- | ------------ | --------- |
| `--mq-bg`             | 容器背景     | `#fffcf7` |
| `--mq-radius`         | 容器圆角     | `8px`     |
| `--mq-text-secondary` | 占位文字颜色 | `#6f675e` |
| `--mq-font-size`      | 占位文字字号 | `14px`    |

## 编码器工具

工具函数位于 `packages/ui/src/components/mq-bar-code/barcode.ts`（未从包根重新导出），可在源码内单独使用：

```ts
import { encodeBarCode, isValidBarCodeText, getBarCodeCheckDigit } from './barcode'

encodeBarCode('590123412345', 'EAN13') // { bars: number[], text: '5901234123457' }
encodeBarCode('CODE39', 'CODE39', { mod43: true }) // 追加 mod43 校验符

isValidBarCodeText('5901234123458', 'EAN13') // false：校验位错误
getBarCodeCheckDigit('590123412345', 'EAN13') // '7'
getBarCodeCheckDigit('9638507', 'EAN8') // '4'
getBarCodeCheckDigit('03600029145', 'UPC-A') // '2'
getBarCodeCheckDigit('CODE39', 'CODE39') // 'W'
```

- `encodeBarCode(text, format?, options?)`：返回 `{ bars, text }`；`bars` 下标 0/2/4… 为黑条，非法输入抛 `Error`（组件会捕获并转为事件）。`options.mod43` 仅对 CODE39 生效。
- `isValidBarCodeText(text, format?, options?)`：不绘制，仅校验输入是否可编码。
- `getBarCodeCheckDigit(text, format)`：返回单个校验字符；EAN/UPC 可传前缀或完整码，CODE128 按自动选集规则返回 mod 103 数值的字符串。
- `getCode128CheckDigit(values)`：CODE128 专用，对已包含起始符的符号值数组计算 mod 103 校验位。

编码能力补充：

- `CODE128B`：完整覆盖 ASCII 32–126；`CODE128A`：ASCII 0–95（含控制字符）；`CODE128C`：偶数位纯数字两位一组压缩。
- EAN13 左侧六位由首位数字决定 L/G 奇偶组合，右侧六位固定 R 编码，含 `101` / `01010` / `101` 保护条。
- EAN8 左侧四位 L 编码，右侧四位 R 编码。
- UPC-A 与 EAN13 共用 95 模块结构，`bars` 与前置 `0` 的 EAN13 完全相同。
