<script setup lang="ts">
import { computed } from 'vue'
import { Form as VeeForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ZodTypeAny } from 'zod'

/**
 * HeadlessForm 组件事件定义
 */
interface HeadlessFormEmits {
  // 表单提交成功时触发，携带验证通过的表单数据
  (e: 'submit', values: Record<string, any>): void
  // 表单验证失败时触发，携带验证错误信息
  (e: 'invalid', errors: unknown): void
}

const emit = defineEmits<HeadlessFormEmits>()

/**
 * HeadlessForm 组件属性定义
 */
const props = withDefaults(
  defineProps<{
    schema?: ZodTypeAny // zod schema 验证规则，用于表单数据验证
    initialValues?: Record<string, any> // 表单初始值，用于设置字段的默认值
    validateOnMount?: boolean // 是否在组件挂载时立即执行验证
  }>(),
  {
    initialValues: () => ({}),
    validateOnMount: false,
  }
)

/**
 * 计算属性：将 Zod schema 转换为 vee-validate 可识别的验证 schema
 * 如果提供了 schema，则使用 @vee-validate/zod 的 toTypedSchema 进行转换
 * 如果没有提供 schema，则返回 undefined，表示不进行 schema 验证
 */
const validationSchema = computed(() =>
  props.schema ? toTypedSchema(props.schema) : undefined
)

/**
 * 表单提交成功回调
 * @param values - 验证通过的表单数据对象
 */
function onSubmit(values: Record<string, any>) {
  emit('submit', values)
}

/**
 * 表单验证失败回调
 * @param ctx - 验证失败的上下文信息，包含错误详情
 */
function onInvalidSubmit(ctx: unknown) {
  emit('invalid', ctx)
}
</script>

<template>
  <!-- 
    vee-validate 的 Form 组件，提供表单验证的核心功能

    - initial-values: 表单初始值，用于设置所有字段的默认值
    - validation-schema: 验证规则，支持 Zod schema 或自定义验证函数
    - validate-on-mount: 是否在组件挂载时立即验证所有字段

    - @submit: 表单验证通过时触发，携带表单数据
    - @invalid-submit: 表单验证失败时触发，携带错误信息
  -->
  <VeeForm
    :initial-values="props.initialValues"
    :validation-schema="validationSchema"
    :validate-on-mount="props.validateOnMount"
    @submit="onSubmit"
    @invalid-submit="onInvalidSubmit"
  >
    <!-- 默认插槽，用于渲染表单内容 子组件可以通过 ElHeadlessFormItem 来创建表单项 -->
    <slot />
  </VeeForm>
</template>
