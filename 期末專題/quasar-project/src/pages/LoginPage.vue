<template>
  <div class="container" id="login">
    <div class="contain">
      <div class="row">
        <div class="logo">
          <q-icon name="egg"></q-icon>
          <span>友伴</span>
        </div>
        <div class="col-12">
          <div class="text-h3">登入</div>
        </div>
        <div class="col-12">
          <q-form @submit="login" ref="formEl">
            <q-input type="text" label="帳號" v-model="form.account" standout="bg-teal text-white"></q-input><br>
            <q-input type="password" label="密碼" v-model="form.password" standout="bg-teal text-white"></q-input>
            <div class="btn-contain">
              <q-btn label="登入" type="submit" :loading="loading"></q-btn>
              <q-btn label="返回" to="/"></q-btn>
            </div>
          </q-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useUserStore } from '../stores/store'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = useUserStore()

const formEl = ref(null)
const loading = ref(false)
const form = reactive({
  account: '',
  password: ''
})

const login = async () => {
  loading.value = true
  await user.login(form)
  loading.value = false
  if (user.isLogin) return router.push('/')
}
</script>
