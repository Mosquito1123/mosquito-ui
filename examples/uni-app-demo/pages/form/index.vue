<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import {
  MqButton,
  MqCalendar,
  MqCalendarView,
  MqCascader,
  MqColPicker,
  MqCell,
  MqCheckbox,
  MqCheckboxGroup,
  MqDatetimePicker,
  MqDivider,
  MqDropMenu,
  MqDropMenuItem,
  MqForm,
  MqFormItem,
  MqGap,
  MqInput,
  MqInputNumber,
  MqPicker,
  MqPopup,
  MqRadio,
  MqRadioGroup,
  MqRate,
  MqSearch,
  MqSelect,
  MqSlider,
  MqSwitch,
  MqTextarea,
  MqUpload,
  showToast,
} from '@mosquito/ui'
import type {
  MqCascaderOption,
  MqColPickerColumnChangePayload,
  MqFormSchema,
  MqSelectOption,
} from '@mosquito/ui'

const inlineDate = ref('2026-11-20')
const colValue = ref<Array<string | number>>(['zj'])
const colColumns = [
  [
    { value: 'zj', label: '浙江' },
    { value: 'js', label: '江苏' },
  ],
]
const colChildren: Record<string, Array<{ value: string; label: string }>> = {
  zj: [
    { value: 'hz', label: '杭州' },
    { value: 'nb', label: '宁波' },
  ],
  js: [
    { value: 'nj', label: '南京' },
    { value: 'sz', label: '苏州' },
  ],
}

function onColChange({ selectedItem, resolve, finish }: MqColPickerColumnChangePayload) {
  const children = colChildren[String(selectedItem.value)]
  if (children?.length) {
    resolve(children)
  } else {
    finish()
  }
}

const nickname = ref('')
const memo = ref('')
const agreed = ref(false)
const notifyOn = ref(true)
const fruit = ref<Array<string | number>>(['apple'])
const shipping = ref('air')
const volume = ref(40)
const score = ref(3)
const count = ref(2)
const query = ref('')

const pickerVisible = ref(false)
const city = ref<Array<string | number>>(['zj', 'hz'])
const cities = [
  {
    value: 'zj',
    label: '浙江',
    children: [
      { value: 'hz', label: '杭州' },
      { value: 'nb', label: '宁波' },
    ],
  },
  {
    value: 'js',
    label: '江苏',
    children: [
      { value: 'nj', label: '南京' },
      { value: 'sz', label: '苏州' },
    ],
  },
]

const calendarVisible = ref(false)
const date = ref('2026-10-20')

const datetimeVisible = ref(false)
const datetimeValue = ref(Date.now())
const datetimeLabel = computed(() => {
  const value = new Date(datetimeValue.value)
  const pad = (item: number) => String(item).padStart(2, '0')
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())} ${pad(value.getHours())}:${pad(value.getMinutes())}`
})

const cascadeVisible = ref(false)
const region = ref<string | number>('hz')
const regionOptions: MqCascaderOption[] = [
  {
    value: 'zj',
    text: '浙江',
    children: [
      { value: 'hz', text: '杭州' },
      { value: 'nb', text: '宁波' },
    ],
  },
  {
    value: 'js',
    text: '江苏',
    children: [
      { value: 'nj', text: '南京' },
      { value: 'sz', text: '苏州' },
    ],
  },
]
const regionLabel = computed(() => {
  for (const group of regionOptions) {
    const child = group.children?.find((item) => item.value === region.value)
    if (child) {
      return `${group.text} / ${child.text}`
    }
  }
  return '请选择'
})

const selectVisible = ref(false)
const selectValue = ref<string | number>('hz')
const selectOptions: MqSelectOption[] = [
  { label: '杭州', value: 'hz' },
  { label: '宁波', value: 'nb' },
  { label: '南京', value: 'nj' },
]
const selectLabel = computed(
  () => selectOptions.find((item) => item.value === selectValue.value)?.label || '请选择',
)

const multiVisible = ref(false)
const multiValue = ref<Array<string | number>>(['hz'])
const tagOptions: MqSelectOption[] = [
  { label: '包邮', value: 'free' },
  { label: '次日达', value: 'next' },
  { label: '支持退换', value: 'refund' },
]
const multiLabel = computed(() => {
  const labels = multiValue.value
    .map((value) => tagOptions.find((item) => item.value === value)?.label)
    .filter(Boolean)
  return labels.length ? labels.join('、') : '请选择'
})

const uploads = ref<string[]>([])

const filter = ref<string | number>('all')
const filterOptions = [
  { label: '全部', value: 'all' },
  { label: '待付款', value: 'unpaid', tip: '下单 30 分钟内' },
  { label: '已发货', value: 'shipped' },
]
const sortValue = ref<string | number>('default')
const sortOptions = [
  { label: '默认排序', value: 'default' },
  { label: '价格从低到高', value: 'price-asc' },
  { label: '销量优先', value: 'sales' },
]

const cityLabel = computed(() => {
  const group = cities.find((item) => item.value === city.value[0])
  const child = group?.children.find((item) => item.value === city.value[1])
  return group && child ? `${group.label} / ${child.label}` : '请选择'
})

const formModel = reactive({ username: '', phone: '' })
const formSchema: MqFormSchema = {
  validate(model) {
    const issues: Array<{ path: Array<string | number>; message: string }> = []
    if (!String(model.username || '').trim()) {
      issues.push({ path: ['username'], message: '请填写用户名' })
    }
    if (!/^\d{11}$/.test(String(model.phone || ''))) {
      issues.push({ path: ['phone'], message: '手机号需为 11 位数字' })
    }
    return issues
  },
  isRequired: (path: string) => path === 'username' || path === 'phone',
}
const formRef = ref()

async function submitForm() {
  const result = await formRef.value?.validate()
  showToast(result?.valid ? '校验通过' : '请先修正表单')
}

function onSearch(payload: { value: string }) {
  const keyword = payload.value.trim()
  showToast(keyword ? `搜索 ${keyword}` : '请输入关键字')
}
</script>

<template>
  <view class="demo">
    <view class="demo__hero">
      <text class="demo__title">表单组件</text>
      <text class="demo__desc">输入、选择、上传与轻量校验。所有值都用 v-model 驱动。</text>
    </view>

    <mq-divider>Input / Textarea 输入</mq-divider>
    <view class="demo__field">
      <mq-input v-model="nickname" placeholder="怎么称呼" :maxlength="12" show-word-limit clearable />
      <mq-input v-model="nickname" placeholder="密码" show-password clearable />
      <mq-textarea
        v-model="memo"
        placeholder="补充说明"
        :maxlength="40"
        show-word-limit
        clearable
        auto-height
      />
    </view>

    <mq-divider>Switch / Checkbox / Radio</mq-divider>
    <view class="demo__field">
      <mq-cell title="通知" clickable @click="notifyOn = !notifyOn">
        <mq-switch v-model="notifyOn" />
      </mq-cell>
      <mq-checkbox v-model="agreed">同意记在这一页</mq-checkbox>
      <text class="demo__note">水果最多选两项</text>
      <mq-checkbox-group v-model="fruit" direction="horizontal" :max="2">
        <mq-checkbox name="apple">苹果</mq-checkbox>
        <mq-checkbox name="pear">梨</mq-checkbox>
        <mq-checkbox name="plum" disabled>李子</mq-checkbox>
      </mq-checkbox-group>
      <mq-radio-group v-model="shipping" direction="horizontal" type="button">
        <mq-radio value="air">空运</mq-radio>
        <mq-radio value="land">陆运</mq-radio>
      </mq-radio-group>
    </view>

    <mq-divider>Slider / Rate / InputNumber / Search</mq-divider>
    <view class="demo__field">
      <mq-slider v-model="volume" show-extreme-value :step="10" />
      <text class="demo__note">音量 {{ volume }}</text>
      <mq-rate v-model="score" allow-half clearable />
      <text class="demo__note">评分 {{ score }}，再点当前星会清空。</text>
      <view class="demo__row">
        <mq-input-number v-model="count" :min="0" :max="9" />
        <mq-button size="small" @click="count = 2">重置为 2</mq-button>
      </view>
      <mq-search v-model="query" placeholder="搜订单" clearable @search="onSearch" />
    </view>

    <mq-divider>Picker / Calendar / DatetimePicker / Cascader</mq-divider>
    <mq-cell title="城市" :value="cityLabel" is-link @click="pickerVisible = true" />
    <mq-cell title="日期" :value="date" is-link @click="calendarVisible = true" />
    <mq-cell title="日期时间" :value="datetimeLabel" is-link @click="datetimeVisible = true" />
    <mq-cell title="地区" :value="regionLabel" is-link @click="cascadeVisible = true" />

    <mq-divider>Select / DropMenu</mq-divider>
    <mq-cell title="单选城市" :value="selectLabel" is-link @click="selectVisible = true" />
    <mq-cell title="多选标签" :value="multiLabel" is-link @click="multiVisible = true" />
    <view class="demo__field">
      <mq-drop-menu>
        <mq-drop-menu-item v-model="filter" title="筛选" :options="filterOptions" />
        <mq-drop-menu-item v-model="sortValue" title="排序" :options="sortOptions" />
      </mq-drop-menu>
    </view>

    <mq-divider>Upload 上传</mq-divider>
    <view class="demo__field">
      <mq-upload v-model="uploads" :max-count="4" tip="选图后先保存在本地路径，接 action 才会上传" />
    </view>

    <mq-divider>Form 校验</mq-divider>
    <view class="demo__field">
      <mq-form ref="formRef" :model="formModel" :schema="formSchema" border>
        <mq-form-item prop="username" title="用户名" required>
          <mq-input v-model="formModel.username" placeholder="请填写用户名" compact />
        </mq-form-item>
        <mq-form-item prop="phone" title="手机号" required>
          <mq-input v-model="formModel.phone" placeholder="11 位数字" compact />
        </mq-form-item>
      </mq-form>
      <mq-button type="primary" block @click="submitForm">提交校验</mq-button>
    </view>

    <mq-gap :height="12" />

    <mq-picker v-model="city" v-model:visible="pickerVisible" title="选择城市" :columns="cities" cascade />
    <mq-popup v-model="calendarVisible" position="bottom" title="选择日期">
      <view class="demo__field">
        <mq-calendar v-model="date" @confirm="calendarVisible = false" />
      </view>
    </mq-popup>
    <mq-datetime-picker
      v-model="datetimeValue"
      v-model:visible="datetimeVisible"
      title="选择日期时间"
      :use-second="false"
    />
    <mq-cascader
      v-model="region"
      v-model:visible="cascadeVisible"
      title="选择地区"
      :options="regionOptions"
    />
    <mq-select
      v-model="selectValue"
      v-model:visible="selectVisible"
      title="选择城市"
      searchable
      placeholder="搜索城市"
      :options="selectOptions"
    />
    <mq-select
      v-model="multiValue"
      v-model:visible="multiVisible"
      title="选择标签"
      multiple
      :options="tagOptions"
    />

    <mq-divider>CalendarView 内联日历</mq-divider>
    <view class="demo__field">
      <mq-calendar-view v-model="inlineDate" type="date" :panel-height="300" />
      <text class="demo__note">已选 {{ inlineDate || '无' }}</text>
    </view>

    <mq-divider>ColPicker 多列联动选择</mq-divider>
    <view class="demo__field">
      <mq-col-picker v-model="colValue" label="地区" :columns="colColumns" :column-change="onColChange" />
      <text class="demo__note">已选 {{ colValue.join(' / ') }}</text>
    </view>

    <text class="demo__foot">表单组件演示结束</text>
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
  padding: 8px 0;
}

.demo__row > .mq-input-number,
.demo__row > .mq-button {
  margin-right: 8px;
}

.demo__field {
  padding: 0 16px 8px;
}

.demo__foot {
  display: block;
  padding: 16px;
  font-size: 12px;
  text-align: center;
  color: var(--mq-text-secondary, #6f675e);
}
</style>
