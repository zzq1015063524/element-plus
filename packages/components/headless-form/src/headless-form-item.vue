<script setup lang="ts">
import { Field } from 'vee-validate'

/**
 * HeadlessFormItem 组件属性定义
 */
const props = withDefaults(
  defineProps<{
    name: string // 字段名称，用于标识表单中的唯一字段，必填
    as?: any // 渲染的 HTML 元素或组件，默认为 undefined（使用插槽渲染）
    validateOnBlur?: boolean // 是否在失焦时触发验证，默认 true
    validateOnChange?: boolean // 是否在值变更时触发验证，默认 true
    validateOnInput?: boolean // 是否在输入时触发验证，默认 false（避免频繁验证影响性能）
    label?: string // 字段标签，用于无障碍访问和错误信息显示
    id?: string // 字段 ID，用于关联 label 元素
  }>(),
  {
    as: undefined,
    validateOnBlur: true,
    validateOnChange: true,
    validateOnInput: false,
    label: undefined,
    id: undefined,
  }
)
</script>

<template>
  <!-- 
    vee-validate 的 Field 组件，提供单个字段的验证和状态管理
    
    - name: 字段名称，用于在表单中唯一标识该字段
    - as: 渲染的元素类型，undefined 表示使用插槽渲染
    - validate-on-blur: 失焦时验证，适合输入完成后验证
    - validate-on-change: 值变更时验证，适合实时反馈
    - validate-on-input: 输入时验证，可能影响性能，默认关闭
    - label: 字段标签，用于无障碍访问
    - id: 字段 ID，用于关联 label 元素
    
    - field: 字段绑定对象，包含 value、onChange、onBlur、name 等
    - errorMessage: 当前字段的验证错误信息
    - meta: 字段元信息，包含 touched、valid、dirty、pending 等状态
    - handleChange: 手动触发值变更的函数
    - handleBlur: 手动触发失焦事件的函数
    - handleReset: 重置字段值的函数
  -->
  <Field
    :id="props.id"
    v-slot="slotProps"
    :name="props.name"
    :as="props.as"
    :validate-on-blur="props.validateOnBlur"
    :validate-on-change="props.validateOnChange"
    :validate-on-input="props.validateOnInput"
    :label="props.label"
  >
    <slot v-bind="slotProps" />
  </Field>
</template>
