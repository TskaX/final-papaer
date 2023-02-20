<template>
  <q-page id="info">
    <div class="row justify-center items-center">
      <q-card class="my-card">
        <q-card-section class="main-card">
          <div class="name">{{ user.name }}</div>
          <q-img class="col-5" :src="user.pic"/>
            <q-card-section class="info_main row">
              <div class="col-12">帳號：<br>{{ user.account }}</div>
              <div class="col-12">密碼：<br>********</div>
              <div class="col-12">生日：<br>{{ user.birth }}</div>
              <div class="col-12">電話：<br>0{{ user.phone}}</div>
              <div class="col-12">信箱：<br>{{ user.email }}</div>
            </q-card-section>
        </q-card-section>
        <q-separator />
        <q-card-actions class="btn-card">
          <q-btn flat label="修改密碼" @click="EditPassword(1)"/>
          <div class="line"></div>
          <q-btn flat label="修改大頭照" @click="PicDialog = true"/>
        </q-card-actions>
      </q-card>
    </div>
    <q-dialog v-model="PicDialog" persistent class="pic-dialog">
      <q-card>
        <q-form @submit="submit" ref="formEl">
          <q-card-section class="row pic-title">
            <div class="text-h6">更換圖片</div>
          </q-card-section>
          <q-card-section class="pic-main">
            <q-file outlined v-model="form.pic" label="選取檔案" />
          </q-card-section>
          <q-card-section class="pic-btn">
            <q-btn label="確認" type="submit" :loading="form.loading"/>
            <q-btn label="取消" v-close-popup :disable="form.loading" ></q-btn>
          </q-card-section>
        </q-form>
      </q-card>
    </q-dialog>
    <q-dialog v-model="formPassword.dialog" persistent class="password-dialog">
      <q-card>
        <q-form @submit="submitPassword">
          <q-card-section class="password-title">
            <div>修改密碼</div>
          </q-card-section>
          <q-card-section class="password-main">
            <div class="col">原本密碼：</div>
            <q-input outlined label="原本密碼" v-model="formPassword.password" :rules="[rules.required, rules.length]" lazy-rules/>
            <div class="col">新的密碼：</div>
            <q-input outlined label="新的密碼" v-model="formPassword.NewPassword" :rules="[rules.required, rules.length]" lazy-rules/>
            <div class="col">確認新的密碼：</div>
            <q-input outlined label="確認新的密碼" v-model="formPassword.CheckPassword" :rules="[rules.required, rules.length]" lazy-rules/>
          </q-card-section>
          <q-card-section class="password-btn">
            <q-btn type="submit" label="確認" :loading="formPassword.loading"></q-btn>
            <q-btn v-close-popup label="取消" :disabled="formPassword.loading"></q-btn>
          </q-card-section>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script setup>
import { useUserStore } from '../stores/store'
import { reactive, ref } from 'vue'
import { apiAuth } from '../boot/axios'
import Swal from 'sweetalert2'

const user = useUserStore()
const PicDialog = ref(false)
const formEl = ref(null)

const form = reactive({
  _id: '',
  pic: undefined,
  loading: false
})

const formPassword = reactive({
  password: '',
  NewPassword: '',
  CheckPassword: '',
  dialog: false,
  loading: false
})

const rules = {
  required (value) {
    return !!value || '欄位必填'
  },
  length (value) {
    return (value.length >= 4 && value.length <= 16) || '長度為4~16個英數字'
  }
}

const EditPassword = (idx) => {
  if (idx === 1) {
    formPassword.password = ''
    formPassword.CheckPassword = ''
    formPassword.NewPassword = ''
    formPassword.dialog = true
  }
}

const submit = async () => {
  form.loading = true
  const fd = new FormData()
  fd.append('pic', form.pic)

  try {
    await apiAuth.patch('/users', fd)
    Swal.fire({
      icon: 'success',
      title: '成功',
      text: '修改成功'
    })
    PicDialog.value = false
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '失敗',
      text: error?.response?.data?.message || '發生錯誤'
    })
  }
  form.loading = false
}

const submitPassword = async () => {
  formPassword.loading = true
  if (formPassword.NewPassword !== formPassword.CheckPassword) {
    Swal.fire({
      icon: 'error',
      title: '失敗',
      text: '新密碼不一致'
    })
    formPassword.dialog = false
  } else {
    await user.changePassword(formPassword)
  }
  formPassword.dialog = false
  formPassword.loading = false
}
</script>
