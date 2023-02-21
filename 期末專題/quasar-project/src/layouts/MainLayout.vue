<template>
  <q-layout view="hHh lpR fff" id="front-layout">
    <q-header elevated class="bg-transparent text-black" height-hint="98">
      <q-toolbar>
        <div class="logo">
          <q-btn icon="egg" to="/" label="友伴"></q-btn>
        </div>
        <q-toolbar-title></q-toolbar-title>
        <q-btn @click="drawerRight = false" icon="fa-solid fa-arrow-right" class="burger-icon" v-if="drawerRight === true"/>
        <q-btn @click="drawerRight = true" icon="fa-solid fa-arrow-left" class="burger-icon" v-if="drawerRight === false"/>
      </q-toolbar>
      <q-drawer show-if-above v-model="drawerRight" side="right" bordered :width="100" :breakpoint="100" >
        <div v-if="isLogin">Hi，{{ user.name }}</div>
        <q-btn v-if="!isLogin" to="/login" label="Login" />
        <q-btn v-if="!isLogin" to="/register" label="Register" />
        <q-btn v-if="isLogin" to="/setting" label="setting" />
        <q-btn v-if="isLogin && isAdmin" to="/backstage"  label="backstage" />
        <q-btn v-if="isLogin" to="/" label="logout" @click="logout"/>
      </q-drawer>
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
import { ref } from 'vue'

const user = useUserStore()
const { isLogin, isAdmin } = storeToRefs(user)
const { logout } = user

const drawerRight = ref(false)
</script>
