import type { InjectionKey, Ref } from 'vue'
import type { ComponentSize } from '@element-plus/constants'
import type { Arrayable } from '@element-plus/utils'
import type { z } from 'zod'

// 表单验证状态
export type FormValidateState = '' | 'error' | 'validating' | 'success'

// 表单验证回调函数
export type FormValidateCallback = (
  isValid: boolean,
  invalidFields?: Record<string, string[]>
) => Promise<void> | void

// 表单验证结果
export type FormValidationResult = Promise<boolean>

// 表单验证失败信息
export interface FormValidateFailure {
  errors: string[] | null
  fields: Record<string, string[]>
}

export interface HeadlessFormContext {
  // 表单数据
  model?: Record<string, any>
  // Zod schema
  schema: z.ZodSchema<any, any, any> | undefined
  // 验证模式
  validateMode?: Ref<'eager' | 'lazy' | 'aggressive'>
  // 表单大小
  size: Ref<ComponentSize>
  // 是否禁用
  disabled: Ref<boolean>
  // 标签位置
  labelPosition: Ref<'left' | 'right' | 'top'>
  // 标签宽度
  labelWidth: Ref<string | number>
  // 标签后缀
  labelSuffix: Ref<string>
  // 是否内联显示
  inline: Ref<boolean>
  // 是否内联显示错误消息
  inlineMessage: Ref<boolean>
  // 是否显示状态图标
  statusIcon: Ref<boolean>
  // 是否显示错误消息
  showMessage: Ref<boolean>
  // 是否隐藏必填星号
  hideRequiredAsterisk: Ref<boolean>
  // 验证失败时是否滚动到错误位置
  scrollToError: Ref<boolean>
  // 滚动选项
  scrollIntoViewOptions: Ref<ScrollIntoViewOptions | boolean>
  requireAsteriskPosition?: Ref<'left' | 'right'>

  // 方法
  getField: (prop: string) => HeadlessFormItemContext | undefined
  addField: (field: HeadlessFormItemContext) => void
  removeField: (field: HeadlessFormItemContext) => void
  resetFields: (props?: Arrayable<string>) => void
  clearValidate: (props?: Arrayable<string>) => void
  validateField: (
    props?: Arrayable<string>,
    callback?: FormValidateCallback
  ) => FormValidationResult
  validate: (callback?: FormValidateCallback) => FormValidationResult
  scrollToField: (prop: string) => void

  // 事件
  emit: (event: string, ...args: any[]) => void
}

export interface HeadlessFormItemContext {
  // 属性
  label?: string
  labelWidth: string | number
  labelPosition: 'left' | 'right' | 'top' | ''
  prop: string
  required: boolean
  error?: string
  validateStatus: FormValidateState
  for?: string
  inlineMessage: string | boolean
  showMessage: boolean
  size: ComponentSize

  // 元素引用
  $el: HTMLDivElement | undefined

  // 状态
  validateMessage: Ref<string>
  validateState: Ref<FormValidateState>
  isGroup: boolean
  labelId: string
  inputIds: string[]
  hasLabel: boolean
  fieldValue: any
  propString: string

  // 方法
  addInputId: (id: string) => void
  removeInputId: (id: string) => void
  validate: (
    trigger: string,
    callback?: FormValidateCallback
  ) => FormValidationResult
  resetField: () => void
  clearValidate: () => void
}

export const headlessFormContextKey: InjectionKey<HeadlessFormContext> = Symbol(
  'headlessFormContextKey'
)
export const headlessFormItemContextKey: InjectionKey<HeadlessFormItemContext> =
  Symbol('headlessFormItemContextKey')

// Zod Schema 类型
export type ZodSchema = z.ZodSchema<any, any, any>
