<template>
  <q-layout q-layout view="hHh lpR fff" id="setting">
    <q-header elevated class="bg-accent">
      <q-toolbar>
        <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
        <q-toolbar-title>管理</q-toolbar-title>
        <q-btn icon="logout" @click="logout"></q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer" show-if-above :mini="miniState" @mouseover="miniState = false" @mouseout="miniState = true" :width="200" :breakpoint="400" bordered class="bg-grey-3">
      <q-list padding>
        <q-item clickable v-ripple to='/setting' exact>
          <q-item-section avatar>
            <q-icon name="account_circle" />
          </q-item-section>
          <q-item-section>
            個人資料
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple to='/comment' v-if="user.partner === 0 || isAdmin">
          <q-item-section avatar>
            <q-icon name="star" />
          </q-item-section>
          <q-item-section>
            貼心小語
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/appointment" v-if="user.partner === 0 || isAdmin">
          <q-item-section avatar>
            <q-icon name="book_online" />
          </q-item-section>
          <q-item-section>
            預約紀錄
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/question" v-if="user.partner === 0 || isAdmin">
          <q-item-section avatar>
            <q-icon name="question_answer" />
          </q-item-section>
          <q-item-section>
            個人發問
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/work" v-if="user.partner === 1 || isAdmin">
          <q-item-section avatar>
            <q-icon name="book_online" />
          </q-item-section>
          <q-item-section>
            工作預約紀錄
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/feedback" v-if="user.partner === 1 || isAdmin">
          <q-item-section avatar>
            <q-icon name="question_answer" />
          </q-item-section>
          <q-item-section>
            會員反饋
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/">
          <q-item-section avatar>
            <q-icon name="arrow_back"/>
          </q-item-section>
          <q-item-section>
            返回首頁
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>
<script setup>
import { ref } from 'vue'
import { useUserStore } from '../stores/store.js'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

const user = useUserStore()
const { isAdmin } = storeToRefs(user)
const router = useRouter()

const drawer = ref(false)
const miniState = ref(true)

const logout = async () => {
  await user.logout()
  router.push('/')
}
(async () => {

})()
</script>
