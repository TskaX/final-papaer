<template>
  <div class="column" id="login">
    <div class="col">
      <h6 style="margin:0px"><a href="/#/">回首頁</a></h6>
    </div>
    <div class="col">
      <h1 style="text-align:center">登入</h1>
    </div>
    <div class="col">
      <q-form @submit="login" ref="formEl">
        <q-input type="text" label="帳號" v-model="form.account"></q-input>
        <q-input type="password" label="密碼" v-model="form.password"></q-input>
        <q-btn label="登入" type="submit" :loading="loading"></q-btn>
      </q-form>
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
