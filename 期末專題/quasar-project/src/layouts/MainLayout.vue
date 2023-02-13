<template>
  <q-layout view="hHh lpR fff" id="front-layout">
    <q-header elevated class="bg-transparent text-black" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <a href="/#">
              title
            </a>
          </q-avatar>
        </q-toolbar-title>
        <span v-if="isLogin">Hi，{{ user.name }}</span>
        <q-btn v-if="!isLogin" to="/login" label="Login" />
        <q-btn v-if="!isLogin" to="/register" label="Register" />
        <q-btn v-if="isLogin" to="/setting" label="setting" />
        <q-btn v-if="isLogin && isAdmin" to="/backstage" label="backstage" />
        <q-btn v-if="isLogin" to="/" label="logout" @click="logout"/>
      </q-toolbar>
    </q-header>

    <q-page-container style="padding-top:0">
      <router-view />
    </q-page-container>

    <!-- <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <div style="margin:auto">我是footer</div>
      </q-toolbar>
    </q-footer> -->

  </q-layout>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useUserStore } from '../stores/store'

const user = useUserStore()
const { isLogin, isAdmin } = storeToRefs(user)
const { logout } = user
</script>
