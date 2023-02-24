<template>
  <q-layout view="hHh lpR fff" id="front-layout">
    <q-header elevated class="text-black" height-hint="98">
      <q-toolbar>
        <div class="logo">
          <q-btn icon="egg" to="/" label="友伴"></q-btn>
        </div>
        <q-toolbar-title>
          <q-btn @click.prevent="anchor('about-us')">關於我們</q-btn>
          <q-btn @click.prevent="anchor('partner-intro')">夥伴介紹</q-btn>
          <q-btn @click.prevent="anchor('contact-us')">聯繫我們</q-btn>
        </q-toolbar-title>
        <q-btn @click="oppt" icon="fa-solid fa-arrow-left" class="burger-icon" v-if="drawerRight === false" />
        <q-btn @click="oppt" icon="fa-solid fa-arrow-right" class="burger-icon" v-if="drawerRight === true" />
      </q-toolbar>
      <div class="side-nav">
        <div v-if="isLogin">Hi，{{ user.name }}</div>
        <q-btn v-if="!isLogin" to="/login" label="Login" />
        <q-btn v-if="!isLogin" to="/register" label="Register" />
        <q-btn v-if="isLogin" to="/setting" label="setting" />
        <q-btn v-if="isLogin && isAdmin" to="/backstage" label="backstage" />
        <q-btn v-if="isLogin" to="/" label="logout" @click="logout" />
      </div>
    </q-header>

    <q-page-container style="padding-top:0">
      <router-view />
    </q-page-container>

    <q-footer unelevated class="bg-grey-9 text-white" id="footer">
      <q-toolbar>
        <div class="company-content">
          地址：新北市泰山區貴子里致遠新村55之1號<br>
          電話：02 0000 0000<br>
          客服服務時間：週一至週五 上午8時30分至12時30分，下午1時30分至5時30分<br>
          <div class="social">
            <q-btn icon="fa-brands fa-instagram" href="https://www.instagram.com/" unelevated></q-btn>
            <q-btn icon="fa-brands fa-youtube" href="https://www.youtube.com/" unelevated></q-btn>
            <q-btn icon="fa-brands fa-github" href="https://www.github.com/" unelevated></q-btn><br>
          </div>
        </div>
        <div class="logo">
          <q-btn icon="egg" label="友伴" unelevated></q-btn>
          <div>
            &copy;泰山職訓前端設計 2023/2/1
          </div>
        </div>
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useUserStore } from '../stores/store'
import { ref } from 'vue'

const user = useUserStore()
const { isLogin, isAdmin } = storeToRefs(user)
const { logout } = user

const anchor = (name) => {
  const height = document.getElementById(name).offsetTop
  window.scroll({
    top: height,
    behavior: 'smooth'
  })
}

const drawerRight = ref(true)
const oppt = () => {
  const sideNav = document.querySelector('.side-nav')
  if (drawerRight.value === true) {
    sideNav.style.cssText = 'display: none'
    drawerRight.value = false
  } else {
    sideNav.style.cssText = 'display: block'
    drawerRight.value = true
  }
}
</script>
