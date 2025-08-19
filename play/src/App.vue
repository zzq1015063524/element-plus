<template>
  <div class="play-container">
    <!-- 基础表单 -->
    <div class="demo-section">
      <el-headless-form :model="basicForm" :schema="basicSchema" label-position="top" @validate="onValidate">
        <el-headless-form-item label="用户名" prop="username">
          <el-input v-model="basicForm.username" placeholder="请输入用户名" />
        </el-headless-form-item>

        <el-headless-form-item label="邮箱" prop="email">
          <el-input v-model="basicForm.email" placeholder="请输入邮箱" />
        </el-headless-form-item>

        <el-headless-form-item label="年龄" prop="age">
          <el-input-number v-model="basicForm.age" :min="1" :max="120" />
        </el-headless-form-item>

        <el-headless-form-item>
          <el-button type="primary" @click="submitBasicForm">提交</el-button>
          <el-button @click="resetBasicForm">重置</el-button>
        </el-headless-form-item>
      </el-headless-form>
    </div>
    <div class="demo-section">
      <el-headless-form :model="inlineForm" :schema="inlineSchema" inline label-position="left" label-width="80px">
        <el-headless-form-item label="姓名" prop="name">
          <el-input v-model="inlineForm.name" placeholder="请输入姓名" />
        </el-headless-form-item>

        <el-headless-form-item label="电话" prop="phone">
          <el-input v-model="inlineForm.phone" placeholder="请输入电话" />
        </el-headless-form-item>

        <el-headless-form-item>
          <el-button type="primary" @click="submitInlineForm">提交</el-button>
          <el-button @click="resetInlineForm">重置</el-button>
        </el-headless-form-item>
      </el-headless-form>
    </div>
    <!-- 复杂验证表单 -->
    <div class="demo-section">
      <el-headless-form :model="complexForm" :schema="complexSchema" label-position="top">
        <el-headless-form-item label="密码" prop="password">
          <el-input v-model="complexForm.password" type="password" placeholder="请输入密码" show-password />
        </el-headless-form-item>

        <el-headless-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="complexForm.confirmPassword" type="password" placeholder="请确认密码" show-password />
        </el-headless-form-item>

        <el-headless-form-item label="网站" prop="website">
          <el-input v-model="complexForm.website" placeholder="请输入网站地址" />
        </el-headless-form-item>

        <el-headless-form-item>
          <el-button type="primary" @click="submitComplexForm">提交</el-button>
          <el-button @click="resetComplexForm">重置</el-button>
        </el-headless-form-item>
      </el-headless-form>
    </div>
    <div class="debug-section">
      <h3>调试信息</h3>
      <div class="debug-tabs">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="基础表单数据" name="basic">
            <pre>{{ JSON.stringify(basicForm, null, 2) }}</pre>
          </el-tab-pane>
          <el-tab-pane label="内联表单数据" name="inline">
            <pre>{{ JSON.stringify(inlineForm, null, 2) }}</pre>
          </el-tab-pane>
          <el-tab-pane label="复杂表单数据" name="complex">
            <pre>{{ JSON.stringify(complexForm, null, 2) }}</pre>
          </el-tab-pane>
          <el-tab-pane label="验证状态" name="validation">
            <pre>{{ JSON.stringify(validationStates, null, 2) }}</pre>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { z } from 'zod'
import { ElMessage } from 'element-plus'
import {
  ElHeadlessForm,
  ElHeadlessFormItem,
} from '../../packages/components/headless-form'
import type { FormItemProp } from '@zzq-monorepo/plus/headless-form-item'
// import { ElHeadlessForm, ElHeadlessFormItem } from '../../packages/components/headless-form'
// import type { FormItemProp } from '../../packages/components/headless-form/src/headless-form-item'

// 基础表单
const basicForm = reactive({
  username: '',
  email: '',
  age: 28,
})

// 内联表单
const inlineForm = reactive({
  name: '',
  phone: '',
})

// 复杂表单
const complexForm = reactive({
  password: '',
  confirmPassword: '',
  website: '',
})

const basicSchema = z.object({
  username: z
    .string()
    .min(3, '用户名至少3个字符')
    .max(20, '用户名最多20个字符'),
  email: z.string().email('请输入有效的邮箱地址'),
  age: z.number().min(18, '年龄必须大于18岁').max(100, '年龄不能超过100岁'),
})

const inlineSchema = z.object({
  name: z.string().min(2, '姓名至少2个字符').max(10, '姓名最多10个字符'),
  phone: z.string().regex(/^1[3-9]\d{9}$/, '请输入有效的手机号码'),
})

const complexSchema = z
  .object({
    password: z
      .string()
      .min(6, '密码至少6位')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, '密码必须包含大小写字母和数字'),
    confirmPassword: z.string().min(1, '请确认密码'),
    website: z.string().url('请输入有效的网站地址').optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '密码不匹配',
    path: ['confirmPassword'],
  })

// 验证状态记录
const validationStates = ref<Record<string, any>>({})
const activeTab = ref('basic')

// 提交处理
const submitBasicForm = async () => {
  try {
    const result = await basicSchema.parseAsync(basicForm)
    ElMessage.success('基础表单验证通过！')
    console.log('基础表单数据:', result)
  } catch (error: any) {
    ElMessage.error('基础表单验证失败！')
    console.error('验证失败:', error)
  }
}

const submitInlineForm = async () => {
  try {
    const result = await inlineSchema.parseAsync(inlineForm)
    ElMessage.success('内联表单验证通过！')
    console.log('内联表单数据:', result)
  } catch (error: any) {
    ElMessage.error('内联表单验证失败！')
    console.error('验证失败:', error)
  }
}

const submitComplexForm = async () => {
  try {
    const result = await complexSchema.parseAsync(complexForm)
    ElMessage.success('复杂表单验证通过！')
    console.log('复杂表单数据:', result)
  } catch (error: any) {
    ElMessage.error('复杂表单验证失败！')
    console.error('验证失败:', error)
  }
}

// 重置处理
const resetBasicForm = () => {
  Object.assign(basicForm, {
    username: '',
    email: '',
    age: 18,
  })
  ElMessage.info('基础表单已重置')
}

const resetInlineForm = () => {
  Object.assign(inlineForm, {
    name: '',
    phone: '',
  })
  ElMessage.info('内联表单已重置')
}

const resetComplexForm = () => {
  Object.assign(complexForm, {
    password: '',
    confirmPassword: '',
    website: '',
  })
  ElMessage.info('复杂表单已重置')
}

// 验证回调
const onValidate = (prop: FormItemProp, isValid: boolean, message: string) => {
  console.error('验证结果:', { prop, isValid, message })
  const key = Array.isArray(prop) ? prop.join('.') : prop
  validationStates.value[key] = { isValid, message, timestamp: Date.now() }
}
</script>

<style lang="scss">
html,
body {
  width: 100vw;
  height: 100vh;
  margin: 0;

  #play {
    height: 100%;
    width: 100%;
  }
}

.play-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.test-section {
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  background-color: #fafafa;
}

.test-section h1 {
  color: #303133;
  margin-bottom: 20px;
}

.test-section h2 {
  color: #606266;
  margin-bottom: 15px;
  font-size: 18px;
}

.test-section h3 {
  color: #606266;
  margin-bottom: 10px;
  font-size: 14px;
}

.demo-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.demo-section {
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  background-color: #fafafa;
}

.demo-section h2 {
  color: #606266;
  margin-bottom: 20px;
  font-size: 18px;
}

.debug-section {
  margin-top: 40px;
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  background-color: #f5f7fa;
}

.debug-tabs {
  background-color: white;
  border-radius: 4px;
  padding: 10px;
}

.debug-section h3 {
  color: #606266;
  margin-bottom: 15px;
}

pre {
  background-color: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
  line-height: 1.4;
  margin-bottom: 15px;
}

/* 表单项样式 */
:deep(.el-headless-form-item) {
  margin-bottom: 18px;
}

:deep(.el-headless-form-item__label) {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #606266;
}

:deep(.el-headless-form-item__content) {
  position: relative;
}

:deep(.el-headless-form-item__error) {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
  position: absolute;
  top: 100%;
  left: 0;
}
</style>
