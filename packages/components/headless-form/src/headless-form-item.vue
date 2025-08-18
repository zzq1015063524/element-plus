<template>
  <div
    ref="formItemRef"
    :class="formItemClasses"
    :role="isGroup ? 'group' : undefined"
    :aria-labelledby="isGroup ? labelId : undefined"
  >
    <div
      v-if="hasLabel"
      :id="labelId"
      :class="ns.e('label')"
      :style="labelStyle"
    >
      <slot name="label" :label="currentLabel">
        {{ currentLabel }}
      </slot>
    </div>

    <div :class="ns.e('content')" :style="contentStyle">
      <slot />
      <transition-group :name="`${ns.namespace.value}-zoom-in-top`">
        <slot v-if="shouldShowError" name="error" :error="validateMessage">
          <div
            :class="validateClasses"
            :style="{ color: 'var(--el-color-danger, #f56c6c)' }"
          >
            {{ validateMessage }}
          </div>
        </slot>
      </transition-group>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  reactive,
  ref,
  toRefs,
  useSlots,
  watch,
} from 'vue'
import { useField } from 'vee-validate'
import {
  addUnit,
  getProp,
  isArray,
  isBoolean,
  isFunction,
} from '@element-plus/utils'
import { useId, useNamespace } from '@element-plus/hooks'
import { useFormSize } from './hooks'
import { headlessFormItemProps } from './headless-form-item'
import { headlessFormContextKey, headlessFormItemContextKey } from './types'

import type { HeadlessFormItemContext } from './types'

defineOptions({
  name: 'HeadlessFormItem',
})

const props = defineProps(headlessFormItemProps)
const slots = useSlots()

const formContext = inject(headlessFormContextKey, undefined)
const parentFormItemContext = inject(headlessFormItemContextKey, undefined)

const _size = useFormSize(undefined)
const ns = useNamespace('headless-form-item')

const labelId = useId().value
const inputIds = ref<string[]>([])

const validateState = ref<'error' | 'validating' | 'success' | ''>('')
const validateMessage = ref('')
const formItemRef = ref<HTMLDivElement>()

// 特殊的内联值
let initialValue: any = undefined
let isResettingField = false

// 计算属性
const labelPosition = computed(
  () => props.labelPosition || formContext?.labelPosition
)

const labelStyle = computed(() => {
  if (labelPosition.value === 'top') {
    return {}
  }
  const lw = props.labelWidth ?? formContext?.labelWidth?.value
  const labelWidth = addUnit(lw || '')
  if (labelWidth) return { width: labelWidth }
  return {}
})

const contentStyle = computed(() => {
  if (labelPosition.value === 'top' || formContext?.inline) {
    return {}
  }
  if (!props.label && !props.labelWidth && isNested) {
    return {}
  }
  const lw = props.labelWidth ?? formContext?.labelWidth?.value
  const labelWidth = addUnit(lw || '')
  if (!props.label && !slots.label) {
    return { marginLeft: labelWidth }
  }
  return {}
})

const formItemClasses = computed(() => [
  ns.b(),
  ns.m(_size.value),
  ns.is('error', validateState.value === 'error'),
  ns.is('validating', validateState.value === 'validating'),
  ns.is('success', validateState.value === 'success'),
  ns.is('required', isRequired.value || props.required),
  ns.is('no-asterisk', !!formContext?.hideRequiredAsterisk.value),
  formContext?.requireAsteriskPosition?.value === 'right'
    ? 'asterisk-right'
    : 'asterisk-left',
  {
    [ns.m('feedback')]: formContext?.statusIcon,
    [ns.m(`label-${labelPosition.value}`)]: labelPosition.value,
  },
])

const _inlineMessage = computed(() =>
  isBoolean(props.inlineMessage)
    ? props.inlineMessage
    : !!formContext?.inlineMessage.value || false
)

const validateClasses = computed(() => [
  ns.e('error'),
  { [ns.em('error', 'inline')]: !!_inlineMessage.value },
])

const propString = computed(() => {
  if (!props.prop) return ''
  return isArray(props.prop) ? props.prop.join('.') : props.prop
})

const hasLabel = computed<boolean>(() => {
  return !!(props.label || slots.label)
})

const labelFor = computed<string | undefined>(() => {
  return (
    props.for ?? (inputIds.value.length === 1 ? inputIds.value[0] : undefined)
  )
})

const isGroup = computed<boolean>(() => {
  return !labelFor.value && hasLabel.value
})

const isNested = !!parentFormItemContext

const isRequired = computed(() => {
  // 从 schema 中检查是否必填
  if (formContext?.schema && props.prop) {
    try {
      const schema = formContext.schema
      const fieldSchema = getProp(schema, props.prop).value
      return (
        fieldSchema &&
        typeof fieldSchema === 'object' &&
        'required' in fieldSchema
      )
    } catch {
      return false
    }
  }
  return false
})

const shouldShowError = computed(
  () =>
    validateState.value === 'error' &&
    props.showMessage &&
    (formContext?.showMessage ?? true)
)

const currentLabel = computed(
  () => `${props.label || ''}${formContext?.labelSuffix || ''}`
)

// 确保字段路径是有效的字符串，且不为空
const fieldPath = computed(() => {
  if (!props.prop) {
    // 如果没有 prop，返回一个唯一的临时字段名
    return `temp_field_${labelId}`
  }

  // 确保 prop 是有效的字符串
  const path = isArray(props.prop) ? props.prop.join('.') : String(props.prop)

  // 如果路径为空或无效，返回临时字段名
  if (!path || path === 'undefined' || path === 'null') {
    return `temp_field_${labelId}`
  }

  return path
})

// 使用 vee-validate 的 useField，确保字段路径有效
const {
  value: fieldValue,
  errorMessage,
  validate: vvValidate,
} = useField(fieldPath, undefined, {
  validateOnValueUpdate: false,
  validateOnMount: false,
})

const modelValue = computed(() => {
  const model = formContext?.model
  if (!model || !props.prop) return undefined
  return getProp(model, props.prop).value
})

let initialized = false

watch(
  modelValue,
  async (val, oldVal) => {
    if (!props.prop || !formContext?.schema) {
      return
    }
    // 同步到 vee-validate 的字段值
    fieldValue.value = val
    // 跳过首次（避免页面加载即报错）
    if (!initialized) {
      initialized = true
      return
    }
    // 主动触发校验
    if (val !== oldVal && props.prop && formContext?.schema) {
      const res = await vvValidate()
      if (res.valid) {
        setValidationState('success')
        formContext?.emit('validate', props.prop!, true, '')
      } else {
        const msg = errorMessage.value || res.errors?.[0] || '校验失败'
        setValidationState('error')
        validateMessage.value = msg
        formContext?.emit('validate', props.prop!, false, msg)
      }
    }
  },
  { immediate: true }
)

// 设置验证状态
const setValidationState = (state: 'error' | 'validating' | 'success' | '') => {
  validateState.value = state
}

// 验证失败处理
const onValidationFailed = (error: string = '验证失败') => {
  setValidationState('error')
  validateMessage.value = error || `${props.prop} 必填`

  formContext?.emit('validate', props.prop!, false, validateMessage.value)
}

// 验证成功处理
const onValidationSucceeded = () => {
  setValidationState('success')
  formContext?.emit('validate', props.prop!, true, '')
}

// 执行验证
const doValidate = async (): Promise<true> => {
  if (!props.prop || !formContext?.schema) {
    return true
  }

  try {
    // 使用 vee-validate 的验证
    const res = await vvValidate()

    if (!res.valid) {
      onValidationFailed(errorMessage.value)
      return Promise.reject({ [String(props.prop)]: [errorMessage.value] })
    } else {
      onValidationSucceeded()
      return true
    }
  } catch (err: any) {
    const errorMessage = err?.message || '校验失败'
    onValidationFailed(errorMessage)
    return Promise.reject({ [String(props.prop)]: [errorMessage] })
  }
}

// 验证方法
const validate: HeadlessFormItemContext['validate'] = async (
  trigger,
  callback
) => {
  if (isResettingField || !props.prop) {
    return false
  }

  const hasCallback = isFunction(callback)
  if (!formContext?.schema) {
    callback?.(false)
    return false
  }

  setValidationState('validating')

  return doValidate()
    .then(() => {
      callback?.(true)
      return true
    })
    .catch((err) => {
      const fields = err
      callback?.(false, fields)
      return hasCallback ? false : Promise.reject(fields)
    })
}

// 清除验证
const clearValidate: HeadlessFormItemContext['clearValidate'] = () => {
  setValidationState('')
  validateMessage.value = ''
  isResettingField = false
}

// 重置字段
const resetField: HeadlessFormItemContext['resetField'] = async () => {
  const model = formContext?.model
  if (!model || !props.prop) return

  const computedValue = getProp(model, props.prop)

  // 防止触发验证
  isResettingField = true

  computedValue.value = initialValue

  await nextTick()
  clearValidate()

  isResettingField = false
}

// 添加输入 ID
const addInputId: HeadlessFormItemContext['addInputId'] = (id: string) => {
  if (!inputIds.value.includes(id)) {
    inputIds.value.push(id)
  }
}

// 移除输入 ID
const removeInputId: HeadlessFormItemContext['removeInputId'] = (
  id: string
) => {
  inputIds.value = inputIds.value.filter((listId) => listId !== id)
}

// 监听错误属性
watch(
  () => props.error,
  (val) => {
    validateMessage.value = val || ''
    setValidationState(val ? 'error' : '')
  },
  { immediate: true }
)

// 监听验证状态
watch(
  () => props.validateStatus,
  (val) => setValidationState(val || '')
)

// 监听 vee-validate 的错误消息
watch(
  () => errorMessage.value,
  (val) => {
    if (val) {
      validateMessage.value = val
      setValidationState('error')
    }
  }
)

const context: HeadlessFormItemContext = reactive({
  ...toRefs(props),
  $el: formItemRef,
  size: _size,
  validateMessage,
  validateState,
  labelId,
  inputIds,
  isGroup,
  hasLabel,
  fieldValue,
  addInputId,
  removeInputId,
  resetField,
  clearValidate,
  validate,
  propString,
}) as unknown as HeadlessFormItemContext

provide(headlessFormItemContextKey, context)

onMounted(() => {
  if (props.prop) {
    formContext?.addField(context)
    initialValue = fieldValue.value
  }
})

onBeforeUnmount(() => {
  formContext?.removeField(context)
})

defineExpose({
  size: _size,
  validateMessage,
  validateState,
  validate,
  clearValidate,
  resetField,
})
</script>
