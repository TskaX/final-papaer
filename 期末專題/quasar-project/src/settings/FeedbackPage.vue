<template>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-card class="my-card bg-secondary text-black" v-for="row in rows" :key="row._id">
      <q-card-section>
        <div class="text-h6">
          {{ row.name}}
        </div>
        <div class="text-subtitle2">
          {{ row.u_reply }}
        </div>
      </q-card-section>

      <q-card-section>
        {{ lorem }}
      </q-card-section>

      <q-separator dark />

      <q-card-actions>
        <q-form @submit="changeColor">
          <q-icon name="fa-regular fa-thumbs-up" v-if="row.thumb" @click="row.thumb = false, changeColor(row._id)" size="2rem"></q-icon>
          <q-icon name="fa-solid fa-thumbs-up" v-else @click= "row.thumb = true, changeColor(row._id)" size="2rem"></q-icon>
          <q-icon name="fa-regular fa-heart" v-if="row.love"  @click="row.love = false, changeColor(row._id)" size="2rem"></q-icon>
          <q-icon name="fa-solid fa-heart" v-else @click="row.love = true, changeColor(row._id)" size="2rem"></q-icon>
        </q-form>
      </q-card-actions>
    </q-card>
  </div>
</template>
<script setup>
import { apiAuth } from 'src/boot/axios'
import { reactive } from 'vue'

const rows = reactive([])

const changeColor = async (id) => {
  const index = rows.findIndex(el => el._id === id)
  try {
    await apiAuth.patch('/users/encourageAppointment/' + rows[index]._id, { thumb: rows[index].thumb, love: rows[index].love })
    console.log('success')
  } catch (error) {
    console.log('error')
  }
};

(async () => {
  const { data } = await apiAuth.get('/users/appointmentReply')
  rows.push(...data.result)
})()
</script>
