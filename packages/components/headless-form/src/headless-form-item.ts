import { componentSizes } from '@element-plus/constants'
import { buildProps, definePropType } from '@element-plus/utils'

import type { ExtractPropTypes, __ExtractPublicPropTypes } from 'vue'
import type { Arrayable } from '@element-plus/utils'

export const headlessFormItemValidateStates = [
  '',
  'error',
  'validating',
  'success',
] as const
export type HeadlessFormItemValidateState =
  typeof headlessFormItemValidateStates[number]

export type FormItemProp = Arrayable<string>

export const headlessFormItemProps = buildProps({
  label: String,
  labelWidth: {
    type: [String, Number],
    default: '',
  },
  labelPosition: {
    type: String,
    values: ['left', 'right', 'top', ''],
    default: '',
  },
  prop: {
    type: definePropType<FormItemProp>([String, Array]),
  },
  required: {
    type: Boolean,
    default: undefined,
  },
  error: String,
  validateStatus: {
    type: String,
    values: headlessFormItemValidateStates,
  },
  for: String,
  inlineMessage: {
    type: [String, Boolean],
    default: '',
  },
  showMessage: {
    type: Boolean,
    default: true,
  },
  size: {
    type: String,
    values: componentSizes,
  },
} as const)

export type HeadlessFormItemProps = ExtractPropTypes<
  typeof headlessFormItemProps
>
export type HeadlessFormItemPropsPublic = __ExtractPublicPropTypes<
  typeof headlessFormItemProps
>
