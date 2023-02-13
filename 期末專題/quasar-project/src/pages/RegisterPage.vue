<template>
  <div class="column" id="register">
    <div class="col">
      <h1 style="text-align:center">註冊</h1>
    </div>
    <div class="col">
      <!-- ref 指向元件本身 -->
      <q-form @submit="register" @reset="reset" ref="formEl">
        <q-input type="text" label="帳號" :rules="[rules.required, rules.length]" v-model="form.account" lazy-rules></q-input>
        <q-input type="password" label="密碼" :rules="[rules.required, rules.length]" v-model="form.password" lazy-rules></q-input>
        <q-input type="email" label="信箱" :rules="[rules.required, rules.email]" v-model="form.email" lazy-rules></q-input>
        <q-input type="text" label="姓名" :rules="[rules.required]" v-model="form.name"> lazy-rules</q-input>
        <q-input type="text" label="電話" :rules="[rules.required]" v-model="form.phone" lazy-rules></q-input>
        <q-input type="text" label="生日" v-model="form.birth"></q-input>
        <q-btn label="註冊" type="submit" color="primary" :loading="loading"/>
        <q-btn label="重寫" type="reset" color="primary"/>
      </q-form>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
import validator from 'validator'
import { useRouter } from 'vue-router'
import { api } from '../boot/axios'
import Swal from 'sweetalert2'

const router = useRouter()
const formEl = ref(null)

const loading = ref(false)
const form = reactive({
  account: '',
  password: '',
  email: '',
  name: '',
  phone: '',
  birth: ''
})

const reset = () => {
  form.account = ''
  form.password = ''
  form.email = ''
  form.name = ''
  form.phone = ''
  form.birth = ''
}

const rules = {
  email (value) {
    return validator.isEmail(value) || '格式錯誤'
  },
  required (value) {
    return !!value || '欄位必填'
  },
  length (value) {
    return (value.length >= 4 && value.length <= 16) || '長度為4~16個英數字'
  }
}

const register = async () => {
  if (!await formEl.value.validate()) return
  loading.value = true
  try {
    await api.post('/users', form)
    await Swal.fire({
      icon: 'success',
      title: '成功',
      text: '註冊成功'
    })
    router.push('/')
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '失敗',
      text: error?.response?.data?.message || '發生錯誤'
    })
  }
  loading.value = false
}
</script>
