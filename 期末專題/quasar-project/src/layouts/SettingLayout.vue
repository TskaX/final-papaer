<template>
  <q-layout q-layout view="hHh lpR fff" id="setting">
    <q-header elevated class="bg-black">
      <q-toolbar>
        <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
        <q-toolbar-title>Header</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer" show-if-above :mini="miniState" @mouseover="miniState = false" @mouseout="miniState = true" :width="200" :breakpoint="500" bordered class="bg-grey-3">
      <q-list padding>
        <q-item clickable v-ripple to='/setting' exact>
          <q-item-section avatar>
            <q-icon name="inbox" />
          </q-item-section>
          <q-item-section>
            個人資料
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple to='/comment'>
          <q-item-section avatar>
            <q-icon name="star" />
          </q-item-section>
          <q-item-section>
            個人評分
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/appointment">
          <q-item-section avatar>
            <q-icon name="send" />
          </q-item-section>
          <q-item-section>
            預約紀錄
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/question">
          <q-item-section avatar>
            <q-icon name="drafts" />
          </q-item-section>
          <q-item-section>
            個人發問
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/">
          <q-item-section avatar>
            <q-icon name="drafts"/>
          </q-item-section>
          <q-item-section>
            返回首頁
          </q-item-section>
        </q-item>
        <q-separator style="margin-top:63vh"/>
        <q-item clickable v-ripple @click="logout">
          <q-item-section avatar>
            <q-icon name="drafts" />
          </q-item-section>
          <q-item-section>
            登出
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
import { useUserStore } from 'src/stores/store'
import { useRouter } from 'vue-router'

const user = useUserStore()
const router = useRouter()

const drawer = ref(false)
const miniState = ref(true)

const logout = async () => {
  await user.logout()
  router.push('/')
}
</script>
