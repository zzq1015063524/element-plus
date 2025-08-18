<template>
  <form ref="formRef">
    <slot />
  </form>
</template>

<script lang="ts" setup>
import { computed, provide, reactive, ref, toRefs, watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { debugWarn, isFunction } from '@element-plus/utils'
import { headlessFormContextKey } from './types'
import { headlessFormEmits, headlessFormProps } from './headless-form'
import { filterFields } from './utils'

import type { Arrayable } from '@element-plus/utils'
import type {
  FormValidateCallback,
  FormValidationResult,
  HeadlessFormContext,
  HeadlessFormItemContext,
} from './types'

const COMPONENT_NAME = 'HeadlessForm'
defineOptions({
  name: COMPONENT_NAME,
})

const props = defineProps(headlessFormProps)
const emit = defineEmits(headlessFormEmits)

const formRef = ref<HTMLElement>()
const fields = ref<HeadlessFormItemContext[]>([])

// 使用vee-validate的useForm
const { handleSubmit, resetForm } = useForm({
  validationSchema: props.schema ? toTypedSchema(props.schema) : undefined,
  initialValues: props.model || {},
  validateOnMount: false,
})

// 获取字段
const getField: HeadlessFormContext['getField'] = (prop) => {
  return filterFields(fields.value, [prop])[0]
}

// 添加字段
const addField: HeadlessFormContext['addField'] = (field) => {
  fields.value.push(field)
}

// 移除字段
const removeField: HeadlessFormContext['removeField'] = (field) => {
  if (field.prop) {
    fields.value.splice(fields.value.indexOf(field), 1)
  }
}

// 重置字段
const resetFields: HeadlessFormContext['resetFields'] = (properties = []) => {
  if (!props.model) {
    debugWarn(COMPONENT_NAME, '重置字段')
    return
  }

  if (properties.length === 0) {
    // 重置整个表单
    resetForm()
  } else {
    // 重置指定字段
    filterFields(fields.value, properties).forEach((field) => {
      field.resetField()
    })
  }
}

// 清除验证
const clearValidate: HeadlessFormContext['clearValidate'] = (props = []) => {
  if (props.length === 0) {
    // 清除所有验证
    fields.value.forEach((field) => field.clearValidate())
  } else {
    // 清除指定字段的验证
    filterFields(fields.value, props).forEach((field) => {
      field.clearValidate()
    })
  }
}

// 检查是否可验证
const isValidatable = computed(() => {
  const hasModel = !!props.model
  if (!hasModel) {
    debugWarn(COMPONENT_NAME, '无法验证')
  }
  return hasModel
})

// 获取需要验证的字段
const obtainValidateFields = (props: Arrayable<string>) => {
  if (fields.value.length === 0) return []
  const filteredFields = filterFields(fields.value, props)
  if (!filteredFields.length) {
    debugWarn(COMPONENT_NAME, '跳过')
    return []
  }
  return filteredFields
}

// 验证字段
const doValidateField = async (
  props: Arrayable<string> = []
): Promise<boolean> => {
  if (!isValidatable.value) return false
  const fields = obtainValidateFields(props)
  if (fields.length === 0) return true

  let validationErrors: Record<string, string[]> = {}

  for (const field of fields) {
    try {
      await field.validate('')
      if (
        field.validateState.value === 'error' &&
        !field.validateMessage.value
      ) {
        field.resetField()
      }
    } catch (errors) {
      validationErrors = {
        ...validationErrors,
        ...(errors as Record<string, string[]>),
      }
    }
  }

  if (Object.keys(validationErrors).length === 0) return true
  return Promise.reject(validationErrors)
}

// 验证字段方法
const validateField: HeadlessFormContext['validateField'] = async (
  modelProps = [],
  callback
) => {
  let result = false
  const shouldThrow = !isFunction(callback)

  try {
    result = await doValidateField(modelProps)
    if (result === true) {
      await callback?.(result)
    }
    return result
  } catch (e) {
    if (e instanceof Error) throw e

    const invalidFields = e as Record<string, string[]>

    if (props.scrollToError) {
      if (formRef.value) {
        const formItem = formRef.value!.querySelector(
          '.headless-form-item.is-error'
        )
        formItem?.scrollIntoView(props.scrollIntoViewOptions)
      }
    }

    !result && (await callback?.(false, invalidFields))
    return shouldThrow && Promise.reject(invalidFields)
  }
}

// 验证整个表单
const validate: HeadlessFormContext['validate'] = async (
  callback?: FormValidateCallback
): FormValidationResult => {
  if (!isValidatable.value) {
    callback?.(false)
    return false
  }

  return new Promise<boolean>((resolve) => {
    handleSubmit(
      () => {
        callback?.(true)
        return true
      },
      ({ errors }) => {
        const errorFields: Record<string, string[]> = {}
        Object.keys(errors).forEach((field) => {
          errorFields[field] = [errors[field] as string]
        })

        if (props.scrollToError && formRef.value) {
          const formItem = formRef.value!.querySelector(
            '.headless-form-item.is-error'
          )
          formItem?.scrollIntoView(props.scrollIntoViewOptions)
        }

        callback?.(false, errorFields)
        resolve(false)
      }
    )()
  })
}

// 定位到指定字段
const scrollToField: HeadlessFormContext['scrollToField'] = (prop) => {
  const field = getField(prop)
  if (field) {
    field.$el?.scrollIntoView(props.scrollIntoViewOptions)
  }
}

// 监听 schema 变化
watch(
  () => props.schema,
  () => {
    if (props.validateOnRuleChange) {
      validate().catch((err) => debugWarn(err))
    }
  },
  { deep: true, flush: 'post' }
)

const context: HeadlessFormContext = reactive({
  ...toRefs(props),
  model: props.model ?? {},
  emit,
  resetFields,
  clearValidate,
  validateField,
  validate,
  getField,
  addField,
  removeField,
  scrollToField,
}) as unknown as HeadlessFormContext

provide(headlessFormContextKey, context)

defineExpose({
  validate,
  validateField,
  resetFields,
  clearValidate,
  scrollToField,
  getField,
  fields,
})
</script>
