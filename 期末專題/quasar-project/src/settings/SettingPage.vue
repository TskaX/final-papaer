<template>
  <q-page style="width:40vw; margin:auto">
    <div class="row justify-center column">
      <img :src="user.pic" style="width:150px;height:150px">

      <q-btn label="change" @click="PicDialog = true" style="width:300px"></q-btn>
      <q-dialog v-model="PicDialog" persistent>
        <q-card>
          <q-form @submit="submit" ref="formEl">
            <q-card-section class="row items-center q-pb-none">
              <div class="text-h6">更換圖片</div>
            </q-card-section>

            <q-file v-model="form.pic" label="Standard" />
            <q-btn label="確認" type="submit" :loading="form.loading"/>
            <q-btn label="取消" v-close-popup :disable="form.loading" ></q-btn>
          </q-form>
        </q-card>
      </q-dialog>

      <div class="col">帳號:{{ user.account }}</div>
      <div class="col">密碼:********
        <q-btn label="修改密碼" @click="EditPassword(1)"></q-btn>
      </div>
      <div class="col">姓名:{{ user.name }}</div>
      <div class="col">電話:0{{ user.phone}}</div>
      <div class="col">信箱:{{ user.email }}</div>
      <div class="col">生日:{{ user.birth }}</div>

      <q-dialog v-model="formPassword.dialog" persistent>
        <q-card>
          <q-form @submit="submitPassword">
            <q-card-section>
              <div class="column">
              <div class="col">原本密碼</div>
                <q-input outlined label="原本密碼" v-model="formPassword.password" :rules="[rules.required, rules.length]" lazy-rules/>
                <div class="col">新的密碼</div>
                <q-input outlined label="新的密碼" v-model="formPassword.NewPassword" :rules="[rules.required, rules.length]" lazy-rules/>
                <div class="col">確認新的密碼</div>
                <q-input outlined label="確認新的密碼" v-model="formPassword.CheckPassword" :rules="[rules.required, rules.length]" lazy-rules/>
                </div>
              <q-btn type="submit" label="確認" :loading="formPassword.loading"></q-btn>
              <q-btn v-close-popup label="取消" :disabled="formPassword.loading"></q-btn>
            </q-card-section>
          </q-form>
        </q-card>
      </q-dialog>
    </div>
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
