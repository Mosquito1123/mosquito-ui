<script setup lang="ts">
import { ref } from 'vue'
import {
  MqButton,
  MqCard,
  MqCollapse,
  MqCollapseItem,
  MqDivider,
  MqGap,
  MqProgress,
  MqStep,
  MqSteps,
  MqStatusTip,
  MqTable,
  MqTimeline,
  MqTimelineItem,
  MqTree,
  MqWaterfall,
  showToast,
} from '@mosquito/ui'
import type { MqTableColumn } from '@mosquito/ui'

const progress = ref(46)
const step = ref(1)
const openPanels = ref<string[]>(['ship'])

const tableColumns: MqTableColumn[] = [
  { prop: 'name', label: '项目', width: 110 },
  {
    prop: 'amount',
    label: '金额',
    align: 'right',
    formatter: (_row, value) => `¥${Number(value).toFixed(2)}`,
  },
  { prop: 'state', label: '状态', width: 76, align: 'center' },
]
const tableData = [
  { id: 1, name: '运费', amount: 12, state: '已付' },
  { id: 2, name: '包装', amount: 3.5, state: '待付' },
]

const treeExpanded = ref<Array<string | number>>(['zj'])
const treeChecked = ref<Array<string | number>>(['hz'])
const treeData = [
  {
    label: '浙江',
    value: 'zj',
    children: [
      { label: '杭州', value: 'hz' },
      { label: '宁波', value: 'nb' },
    ],
  },
  {
    label: '江苏',
    value: 'js',
    children: [{ label: '南京', value: 'nj' }],
  },
]

const waterfallData = [
  { title: '运费说明', height: 72 },
  { title: '包装清单', height: 96 },
  { title: '配送范围', height: 88 },
  { title: '退换规则', height: 68 },
  { title: '发票说明', height: 80 },
  { title: '常见问题', height: 104 },
]
const waterfallHeight = (item: { height: number }) => item.height

function bumpProgress(delta: number) {
  progress.value = Math.min(100, Math.max(0, progress.value + delta))
}

function moveStep(delta: number) {
  step.value = Math.min(2, Math.max(0, step.value + delta))
}

function onTableRow(row: Record<string, unknown>) {
  showToast(`${String(row.name)} 行`)
}
</script>

<template>
  <view class="demo">
    <view class="demo__hero">
      <text class="demo__title">展示组件</text>
      <text class="demo__desc">卡片、进度、步骤、折叠、表格、树、时间线与瀑布流。</text>
    </view>

    <mq-divider>Card 卡片</mq-divider>
    <view class="demo__field">
      <mq-card title="订单摘要">
        <text class="demo__note">卡片内容走默认插槽，底部内容走 footer 插槽。</text>
      </mq-card>
    </view>

    <mq-divider>Progress 进度条</mq-divider>
    <view class="demo__field">
      <mq-progress :percentage="progress" />
      <mq-progress :percentage="100" status="success" hide-text />
    </view>
    <view class="demo__row">
      <mq-button size="small" @click="bumpProgress(-10)">减十</mq-button>
      <mq-button size="small" type="primary" @click="bumpProgress(10)">加十</mq-button>
    </view>

    <mq-divider>Steps 步骤条</mq-divider>
    <view class="demo__field">
      <mq-steps :active="step" align-center>
        <mq-step title="下单" description="已提交" />
        <mq-step title="发货" />
        <mq-step title="签收" />
      </mq-steps>
    </view>
    <view class="demo__row">
      <mq-button size="small" @click="moveStep(-1)">上一步</mq-button>
      <mq-button size="small" type="primary" @click="moveStep(1)">下一步</mq-button>
    </view>

    <mq-divider>Collapse 折叠面板</mq-divider>
    <view class="demo__field">
      <mq-collapse v-model="openPanels">
        <mq-collapse-item name="ship" title="配送说明">
          <text>空运两天，陆运五天。</text>
        </mq-collapse-item>
        <mq-collapse-item name="pay" title="付款说明">
          <text>记在这一页，不连支付。</text>
        </mq-collapse-item>
      </mq-collapse>
    </view>

    <mq-divider>Table 表格</mq-divider>
    <view class="demo__field">
      <mq-table
        :data="tableData"
        :columns="tableColumns"
        row-key="id"
        stripe
        border
        size="small"
        @row-click="onTableRow"
      />
    </view>

    <mq-divider>Tree 树形选择</mq-divider>
    <view class="demo__field">
      <mq-tree v-model="treeChecked" v-model:expanded="treeExpanded" :data="treeData" checkable />
      <text class="demo__note">已选 {{ treeChecked.join('、') || '无' }}</text>
    </view>

    <mq-divider>Timeline 时间线</mq-divider>
    <view class="demo__field">
      <mq-timeline>
        <mq-timeline-item title="下单" time="09:20" active>订单已创建，等待支付</mq-timeline-item>
        <mq-timeline-item title="发货" time="14:05">仓库已出库，运输中</mq-timeline-item>
        <mq-timeline-item title="签收" time="待定">等待收货</mq-timeline-item>
      </mq-timeline>
    </view>

    <mq-divider>Waterfall 瀑布流</mq-divider>
    <view class="demo__field">
      <mq-waterfall :data="waterfallData" :column="2" :gap="10" :estimate-height="waterfallHeight">
        <template #default="{ item }">
          <view class="demo__waterfall-card" :style="{ height: `${item.height}px` }">
            <text>{{ item.title }}</text>
          </view>
        </template>
      </mq-waterfall>
    </view>

    <mq-divider>StatusTip 缺省提示</mq-divider>
    <view class="demo__field">
      <mq-status-tip image="search" tip="没有找到相关订单" />
    </view>

    <mq-gap :height="12" />
    <text class="demo__foot">展示组件演示结束</text>
  </view>
</template>

<style lang="scss">
.demo {
  min-height: 100vh;
  padding: 16px 0 32px;
  background: var(--mq-bg-muted, #f6f1e8);
}

.demo__hero {
  padding: 8px 16px 16px;
}

.demo__title {
  display: block;
  font-size: 22px;
  font-weight: 600;
  color: var(--mq-text, #1c1915);
}

.demo__desc {
  display: block;
  margin-top: 6px;
  font-size: 13px;
  color: var(--mq-text-secondary, #6f675e);
}

.demo__note {
  display: block;
  padding: 8px 0;
  font-size: 12px;
  color: var(--mq-text-secondary, #6f675e);
}

.demo__row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  padding: 8px 16px;
}

.demo__row > .mq-button {
  margin-right: 8px;
}

.demo__field {
  padding: 0 16px 8px;
}

.demo__waterfall-card {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  font-size: 13px;
  color: var(--mq-text, #1c1915);
  background: var(--mq-fill, #f3efe7);
  border-radius: 10px;
}

.demo__foot {
  display: block;
  padding: 16px;
  font-size: 12px;
  text-align: center;
  color: var(--mq-text-secondary, #6f675e);
}
</style>
