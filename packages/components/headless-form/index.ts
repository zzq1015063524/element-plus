import { withInstall, withNoopInstall } from '@element-plus/utils'
import HeadlessForm from './src/headless-form.vue'
import HeadlessFormItem from './src/headless-form-item.vue'

/**
 * 无样式表单组件 - 基于 vee-validate 和 zod 的轻量级表单
 *
 * - 内置 vee-validate 验证引擎，支持实时验证
 * - 集成 zod schema 验证，提供类型安全的表单验证
 *
 * 使用示例：
 * ```vue
 * <ElHeadlessForm :schema="schema" @submit="onSubmit">
 *   <ElHeadlessFormItem name="email" v-slot="{ field, errorMessage }">
 *     <input v-bind="field" />
 *     <span v-if="errorMessage">{{ errorMessage }}</span>
 *   </ElHeadlessFormItem>
 * </ElHeadlessForm>
 * ```
 */
export const ElHeadlessForm = withInstall(HeadlessForm, {
  HeadlessFormItem,
})
export default ElHeadlessForm

/**
 * 无样式表单项组件 - 字段级别的验证和状态管理
 *
 * - 基于 vee-validate 的 Field 组件封装
 * - 通过插槽暴露字段状态、错误信息等
 *
 * 插槽属性：
 * - field: 字段绑定对象，包含 value、onChange、onBlur 等
 * - errorMessage: 验证错误信息
 * - meta: 字段元信息（touched、valid、dirty 等）
 * - handleChange: 手动触发值变更
 * - handleBlur: 手动触发失焦事件
 */
export const ElHeadlessFormItem = withNoopInstall(HeadlessFormItem)

// 导出类型定义，供外部使用
export * from './src/types'

// 导出组件实例类型
export type HeadlessFormInstance = InstanceType<typeof HeadlessForm>
export type HeadlessFormItemInstance = InstanceType<typeof HeadlessFormItem>
