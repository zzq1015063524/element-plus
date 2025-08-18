import { componentSizes } from '@element-plus/constants'
import {
  buildProps,
  definePropType,
  isArray,
  isBoolean,
  isString,
} from '@element-plus/utils'

import type { ExtractPropTypes, __ExtractPublicPropTypes } from 'vue'
import type { FormItemProp } from './headless-form-item'
import type { ZodSchema } from './types'

export const headlessFormMetaProps = buildProps({
  size: {
    type: String,
    values: componentSizes,
  },
  disabled: Boolean,
} as const)

export const headlessFormProps = buildProps({
  ...headlessFormMetaProps,
  model: Object,
  schema: {
    type: definePropType<ZodSchema>(Object),
  },
  validateMode: {
    type: String,
    values: ['eager', 'lazy', 'aggressive'],
    default: 'lazy',
  },
  labelPosition: {
    type: String,
    values: ['left', 'right', 'top'],
    default: 'right',
  },
  requireAsteriskPosition: {
    type: String,
    values: ['left', 'right'],
    default: 'left',
  },
  labelWidth: {
    type: [String, Number],
    default: '',
  },
  labelSuffix: {
    type: String,
    default: '',
  },
  inline: Boolean,
  inlineMessage: Boolean,
  statusIcon: Boolean,
  showMessage: {
    type: Boolean,
    default: true,
  },
  // 当schema属性更改时是否触发验证。
  validateOnRuleChange: {
    type: Boolean,
    default: true,
  },
  // 星号
  hideRequiredAsterisk: Boolean,
  scrollToError: Boolean,
  scrollIntoViewOptions: {
    type: definePropType<ScrollIntoViewOptions | boolean>([Object, Boolean]),
    default: true,
  },
} as const)

export type HeadlessFormProps = ExtractPropTypes<typeof headlessFormProps>
export type HeadlessFormPropsPublic = __ExtractPublicPropTypes<
  typeof headlessFormProps
>

export type HeadlessFormMetaProps = ExtractPropTypes<
  typeof headlessFormMetaProps
>
export type HeadlessFormMetaPropsPublic = __ExtractPublicPropTypes<
  typeof headlessFormMetaProps
>

export const headlessFormEmits = {
  validate: (prop: FormItemProp, isValid: boolean, message: string) =>
    (isArray(prop) || isString(prop)) &&
    isBoolean(isValid) &&
    isString(message),
}

export type HeadlessFormEmits = typeof headlessFormEmits
