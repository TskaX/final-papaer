import { defineStore } from 'pinia'
import { api, apiAuth } from 'src/boot/axios'
import { ref, computed } from 'vue'
import Swal from 'sweetalert2'

export const useUserStore = defineStore('user', () => {
  const account = ref('')
  const email = ref('')
  const name = ref('')
  const phone = ref('')
  const birth = ref('')
  const role = ref(0)
  const token = ref('')
  const pic = ref('')
  const available = ref('')
  const partner = ref('')

  const isLogin = computed(() => {
    return token.value.length > 0
  })

  const isAdmin = computed(() => {
    return role.value === 1
  })

  const login = async (form) => {
    try {
      const { data } = await api.post('/users/login', form)
      if (data.result.available === 0) {
        Swal.fire({
          icon: 'error',
          title: '失敗',
          text: '該使用者目前無法使用，請聯絡客服'
        })
      } else {
        token.value = data.result.token
        account.value = data.result.account
        email.value = data.result.email
        name.value = data.result.name
        phone.value = data.result.phone
        birth.value = data.result.birth
        role.value = data.result.role
        available.value = data.result.available
        partner.value = data.result.partner
        Swal.fire({
          icon: 'success',
          title: '成功',
          text: '登入成功'
        })
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '失敗',
        text: '登入失敗'
      })
    }
  }

  const logout = async () => {
    try {
      await apiAuth.delete('/users/logout')
      token.value = ''
      account.value = ''
      email.value = ''
      name.value = ''
      phone.value = ''
      birth.value = 0
      role.value = 0
      partner.value = 0
      await Swal.fire({
        icon: 'success',
        title: '成功',
        text: '登出成功'
      })
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '失敗',
        text: '登出失敗'
      })
    }
  }

  const getUser = async () => {
    if (token.value.length === 0) return
    try {
      const { data } = await apiAuth.get('/users/me')
      account.value = data.result.account
      name.value = data.result.name
      email.value = data.result.email
      phone.value = data.result.phone
      birth.value = data.result.birth
      role.value = data.result.role
      pic.value = data.result.pic
      partner.value = data.result.partner
    } catch (error) {
      logout()
    }
  }

  const changePassword = async (form) => {
    try {
      await apiAuth.patch('/users/password', form)
      Swal.fire({
        icon: 'success',
        title: '成功',
        text: '修改成功'
      })
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '失敗',
        text: '密碼錯誤'
      })
    }
  }

  // const register = async()
  return {
    account, email, name, phone, birth, role, login, token, isLogin, isAdmin, logout, getUser, pic, changePassword, available, partner
  }
}, {
  persist: {
    paths: ['token'],
    key: 'quasar-test'
  }
})
