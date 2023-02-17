<template>
  <q-layout q-layout view="hHh lpR fff" id="setting">
    <q-header elevated class="bg-black">
      <q-toolbar>
        <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
        <q-toolbar-title>Header</q-toolbar-title>
        <q-btn icon="logout" @click="logout"></q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer" show-if-above :mini="miniState" @mouseover="miniState = false" @mouseout="miniState = true" :width="200" :breakpoint="500" bordered class="bg-grey-3">
      <q-list padding>
        <q-item clickable v-ripple to='/backstage' exact>
          <q-item-section avatar>
            <q-icon name="inbox" />
          </q-item-section>
          <q-item-section>
            會員管理
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple to='/partner'>
          <q-item-section avatar>
            <q-icon name="star" />
          </q-item-section>
          <q-item-section>
            夥伴管理
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/appointmentManage">
          <q-item-section avatar>
            <q-icon name="send" />
          </q-item-section>
          <q-item-section>
            訂單管理
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/pageMessageManage">
          <q-item-section avatar>
            <q-icon name="send" />
          </q-item-section>
          <q-item-section>
            頁面訊息管理
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/questionManage">
          <q-item-section avatar>
            <q-icon name="drafts" />
          </q-item-section>
          <q-item-section>
            意見/問題管理
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
