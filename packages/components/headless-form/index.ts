import { withInstall } from '@element-plus/utils'
import HeadlessForm from './src/headless-form.vue'
import HeadlessFormItem from './src/headless-form-item.vue'

export const ElHeadlessForm = withInstall(HeadlessForm)
export const ElHeadlessFormItem = withInstall(HeadlessFormItem)

export default ElHeadlessForm

export * from './src/types'
export * from './src/headless-form'
export * from './src/headless-form-item'
