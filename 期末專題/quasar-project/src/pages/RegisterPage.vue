<template>
  <div class="container" id="register">
    <div class="contain">
      <div class="row">
        <div class="logo">
          <q-icon name="egg"></q-icon>
          <span>友伴</span>
        </div>
        <div class="col-12" style="min-height: none;">
          <div class="text-h3">註冊</div>
          <q-btn icon="fa-solid fa-xmark" round to="/"></q-btn>
        </div>
        <div class="col-12">
          <q-form @submit="register" @reset="reset" ref="formEl">
            <q-input type="text" label="帳號" :rules="[rules.required, rules.length]" v-model="form.account"
              lazy-rules standout="bg-teal text-white"></q-input>
            <q-input type="password" label="密碼" :rules="[rules.required, rules.length]" v-model="form.password"
              lazy-rules standout="bg-teal text-white"></q-input>
            <q-input type="email" label="信箱" :rules="[rules.required, rules.email]" v-model="form.email"
              lazy-rules standout="bg-teal text-white"></q-input>
            <q-input type="text" label="姓名" :rules="[rules.required]" v-model="form.name" lazy-rules standout="bg-teal text-white"></q-input>
            <q-input type="text" label="電話" :rules="[rules.required, rules.phoneLength]" v-model="form.phone" lazy-rules standout="bg-teal text-white"></q-input>
            <q-input type="text" label="生日 ex - 2000/01/01" v-model="form.birth" standout="bg-teal text-white"></q-input>
            <div class="btn-contain">
              <q-btn label="註冊" type="submit" color="primary" :loading="loading" />
              <q-btn label="重寫" type="reset" color="primary" />
            </div>
          </q-form>
        </div>
      </div>
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
  },
  phoneLength (value) {
    return (value.length === 10 || '手機號碼格式錯誤')
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
