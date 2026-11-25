import { describe, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick, ref } from 'vue'
import MqCheckboxGroup from '@/components/mq-checkbox-group/MqCheckboxGroup.vue'
import MqCheckbox from '@/components/mq-checkbox/MqCheckbox.vue'
import type { MqOptionValue } from '@/utils/model'

interface ChildOption {
  name?: MqOptionValue
  disabled?: boolean
  readonly?: boolean
  type?: 'circle' | 'square' | 'button' | 'dot'
  indeterminate?: boolean
}

type GroupWrapper = ReturnType<typeof mountGroup>

function mountGroup(
  props: Record<string, unknown> = {},
  children: ChildOption[] = [{ name: 'a' }, { name: 'b' }, { name: 'c' }],
) {
  return mount(MqCheckboxGroup, {
    props: { modelValue: [], ...props },
    slots: {
      default: () =>
        children.map((child) =>
          h(
            MqCheckbox,
            {
              name: child.name,
              disabled: child.disabled,
              readonly: child.readonly,
              type: child.type,
              indeterminate: child.indeterminate,
            },
            () => String(child.name),
          ),
        ),
    },
  })
}

function api(wrapper: GroupWrapper) {
  return wrapper.vm as unknown as {
    toggleAll: (
      checkedOrOptions?: boolean | { checked?: boolean; skipDisabled?: boolean },
      skipDisabled?: boolean,
    ) => void
    clear: () => void
  }
}

describe('MqCheckboxGroup', () => {
  test('渲染分组方向并托管子项点击', async () => {
    const wrapper = mountGroup()
    expect(wrapper.classes()).toContain('mq-checkbox-group--vertical')
    expect(wrapper.findAllComponents(MqCheckbox)).toHaveLength(3)

    await wrapper.findAll('.mq-checkbox')[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[['a']]])
    expect(wrapper.emitted('change')![0][0]).toEqual({ value: ['a'] })

    await wrapper.setProps({ modelValue: ['a'] })
    expect(wrapper.findAll('.mq-checkbox')[0].classes()).toContain('is-checked')
  })

  test('toggleAll(true) / toggleAll(false) 全选与全不选', () => {
    const all = mountGroup()
    api(all).toggleAll(true)
    expect(all.emitted('update:modelValue')).toEqual([[['a', 'b', 'c']]])
    expect(all.emitted('change')![0][0]).toEqual({ value: ['a', 'b', 'c'] })

    const none = mountGroup({ modelValue: ['a', 'b', 'c'] })
    api(none).toggleAll(false)
    expect(none.emitted('update:modelValue')).toEqual([[[]]])
  })

  test('toggleAll() 不传参时逐个取反', () => {
    const wrapper = mountGroup({ modelValue: ['a'] })
    api(wrapper).toggleAll()
    expect(wrapper.emitted('update:modelValue')).toEqual([[['b', 'c']]])
  })

  test('toggleAll 遵守 min / max 限制', () => {
    const limited = mountGroup({ max: 2 })
    api(limited).toggleAll(true)
    expect(limited.emitted('update:modelValue')).toEqual([[['a', 'b']]])

    const floored = mountGroup({ min: 1, modelValue: ['a', 'b'] })
    api(floored).toggleAll(false)
    expect(floored.emitted('update:modelValue')).toEqual([[['b']]])
  })

  test('skipDisabled 保留禁用与只读子项的原状态', () => {
    const children: ChildOption[] = [
      { name: 'a' },
      { name: 'b', disabled: true },
      { name: 'c', readonly: true },
    ]
    const skipped = mountGroup({}, children)
    api(skipped).toggleAll(true, true)
    expect(skipped.emitted('update:modelValue')).toEqual([[['a']]])

    const kept = mountGroup({ modelValue: ['a', 'b', 'c'] }, children)
    api(kept).toggleAll(false, true)
    expect(kept.emitted('update:modelValue')).toEqual([[['b', 'c']]])
  })

  test('不传 skipDisabled 时禁用子项也参与批量切换', () => {
    const wrapper = mountGroup({}, [{ name: 'a' }, { name: 'b', disabled: true }])
    api(wrapper).toggleAll(true)
    expect(wrapper.emitted('update:modelValue')).toEqual([[['a', 'b']]])
  })

  test('toggleAll 支持对象参数形式', () => {
    const wrapper = mountGroup({}, [{ name: 'a' }, { name: 'b', disabled: true }])
    api(wrapper).toggleAll({ checked: true, skipDisabled: true })
    expect(wrapper.emitted('update:modelValue')).toEqual([[['a']]])
  })

  test('目标状态相同时不重复提交', () => {
    const wrapper = mountGroup({ modelValue: ['a', 'b', 'c'] })
    api(wrapper).toggleAll(true)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  test('clear 清空选择并遵守 min', () => {
    const wrapper = mountGroup({ modelValue: ['a', 'b'] })
    api(wrapper).clear()
    expect(wrapper.emitted('update:modelValue')).toEqual([[[]]])

    const floored = mountGroup({ min: 1, modelValue: ['a', 'b'] })
    api(floored).clear()
    expect(floored.emitted('update:modelValue')).toEqual([[['b']]])

    const standalone = mount(MqCheckboxGroup, { props: { modelValue: ['x', 'y'] } })
    api(standalone).clear()
    expect(standalone.emitted('update:modelValue')).toEqual([[[]]])
  })

  test('分组禁用或只读时批量方法不生效', () => {
    const disabled = mountGroup({ disabled: true, modelValue: [] })
    api(disabled).toggleAll(true)
    api(disabled).clear()
    expect(disabled.emitted('update:modelValue')).toBeUndefined()

    const readonly = mountGroup({ readonly: true, modelValue: ['a'] })
    api(readonly).toggleAll(false)
    expect(readonly.emitted('update:modelValue')).toBeUndefined()
  })

  test('子项卸载后不再参与批量切换', async () => {
    const show = ref(true)
    const wrapper = mount(MqCheckboxGroup, {
      props: { modelValue: [] },
      slots: {
        default: () => [
          h(MqCheckbox, { name: 'a' }),
          h(MqCheckbox, { name: 'b' }),
          ...(show.value ? [h(MqCheckbox, { name: 'c' })] : []),
        ],
      },
    })
    show.value = false
    await nextTick()
    api(wrapper).toggleAll(true)
    expect(wrapper.emitted('update:modelValue')).toEqual([[['a', 'b']]])
  })

  test('未设置 name 的子项不参与批量切换', () => {
    const wrapper = mountGroup({}, [{ name: 'a' }, {}, { name: 'c' }])
    api(wrapper).toggleAll(true)
    expect(wrapper.emitted('update:modelValue')).toEqual([[['a', 'c']]])
  })
})

describe('MqCheckbox 新增 API', () => {
  test('toggle 暴露方法与点击行为一致，禁用态不切换', () => {
    const wrapper = mount(MqCheckbox, { props: { modelValue: false } })
    const vm = wrapper.vm as unknown as { toggle: () => void }
    vm.toggle()
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
    expect(wrapper.emitted('change')![0][0]).toEqual({ value: true })

    const disabled = mount(MqCheckbox, { props: { modelValue: false, disabled: true } })
    ;(disabled.vm as unknown as { toggle: () => void }).toggle()
    expect(disabled.emitted('update:modelValue')).toBeUndefined()
  })

  test('indeterminate 渲染半选样式与 mixed 语义', () => {
    const wrapper = mount(MqCheckbox, { props: { modelValue: false, indeterminate: true } })
    expect(wrapper.classes()).toContain('is-indeterminate')
    expect(wrapper.attributes('aria-checked')).toBe('mixed')

    const normal = mount(MqCheckbox, { props: { modelValue: true } })
    expect(normal.classes()).not.toContain('is-indeterminate')
    expect(normal.attributes('aria-checked')).toBe('true')
  })

  test('dot 类型保留原有圆点外观类', () => {
    const wrapper = mount(MqCheckbox, { props: { type: 'dot', modelValue: true } })
    expect(wrapper.classes()).toContain('mq-checkbox--dot')
    expect(wrapper.classes()).toContain('is-checked')
  })
})
