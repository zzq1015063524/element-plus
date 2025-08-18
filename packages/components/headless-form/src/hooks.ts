import { computed, inject } from 'vue'
import { headlessFormContextKey } from './types'

import type { ComponentSize } from '@element-plus/constants'
import type { HeadlessFormContext } from './types'

/**
 * 使用表单大小
 * @param size 大小
 * @returns 计算后的大小
 */
export const useFormSize = (size?: ComponentSize) => {
  const formContext = inject<HeadlessFormContext | undefined>(
    headlessFormContextKey,
    undefined
  )

  return computed(() => size ?? formContext?.size?.value ?? 'default')
}
