<template>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-card class="my-card bg-secondary text-black" v-for="row in rows" :key="row._id">
      <q-card-section>
        <div class="text-h6">
          {{ row.p_name}}
        </div>
        <div class="text-subtitle2">
          {{ row.p_reply }}
        </div>
      </q-card-section>

      <q-card-section>
        {{ lorem }}
      </q-card-section>

      <q-separator dark />

      <q-card-actions>
        <q-form @submit="changeColor">
          <q-btn icon="fa-regular fa-thumbs-up" v-if="form.originThumb" type="submit"></q-btn>
          <q-btn icon="fa-solid fa-thumbs-up" v-if="form.changeThumb" type="submit"></q-btn>
          <q-btn icon="fa-regular fa-heart" v-if="form.originHeart" type="submit"></q-btn>
          <q-btn icon="fa-solid fa-heart" v-if="form.changeHeart" type="submit"></q-btn>
        </q-form>
      </q-card-actions>
    </q-card>
  </div>
</template>
<script setup>
import { apiAuth } from 'src/boot/axios'
import { reactive } from 'vue'

const rows = reactive([])
const form = reactive({
  changeThumb: false,
  changeHeart: false,
  originThumb: true,
  originHeart: true
})

const changeColor = () => {
  if (form.originThumb === true) {
    form.changeThumb = true
    form.originThumb = false
  } else if (form.originThumb === false) {
    form.changeThumb = false
    form.originThumb = true
  } else if (form.originHeart === true) {
    form.changeHeart = true
    form.originHeart = false
  } else if (form.originHeart === false) {
    form.changeHeart = false
    form.originHeart = true
  }
}

(async () => {
  const { data } = await apiAuth.get('/users/appointmentReply')
  rows.push(...data.result)
})()
</script>
