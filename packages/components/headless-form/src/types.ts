import type { ZodTypeAny } from 'zod'
import type { FieldSlotProps } from 'vee-validate'

/**
 * HeadlessForm 组件的属性接口
 */
export interface HeadlessFormProps {
  schema?: ZodTypeAny
  initialValues?: Record<string, any>
  validateOnMount?: boolean
}

/**
 * HeadlessFormItem 组件的属性接口
 */
export interface HeadlessFormItemProps {
  name: string
  as?: any
  validateOnBlur?: boolean
  validateOnChange?: boolean
  validateOnInput?: boolean
  label?: string
  id?: string
}

/**
 * HeadlessFormItem 插槽属性类型
 *
 * 继承自 vee-validate 的 FieldSlotProps，包含：
 * - field: 字段绑定对象
 * - errorMessage: 错误信息
 * - meta: 字段元信息
 * - handleChange: 手动变更函数
 * - handleBlur: 手动失焦函数
 * - handleReset: 重置函数
 */
export type HeadlessFormItemSlotProps = FieldSlotProps
