import type { Arrayable } from '@element-plus/utils'
import type { HeadlessFormItemContext } from './types'

/**
 * 过滤字段
 * @param fields 字段数组
 * @param props 属性数组
 * @returns 过滤后的字段数组
 */
export const filterFields = (
  fields: ReadonlyArray<HeadlessFormItemContext>,
  props: Arrayable<string>
) => {
  const normalizedProps = Array.isArray(props) ? props : [props]
  if (normalizedProps.length === 0) {
    return fields
  }
  return fields.filter((field) => {
    return normalizedProps.some((prop) => {
      if (typeof prop === 'string') {
        return field.prop === prop
      }
      return false
    })
  })
}
