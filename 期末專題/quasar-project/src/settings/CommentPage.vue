<template>
  <div class="q-pa-md row items-start q-gutter-md" id="comment">
    <div class="title col-12">貼心小語</div>
    <q-card class="my-card bg-secondary text-black col-11 col-md-3" v-for="row in rows" :key="row._id">
      <q-card-section class="comment-main">
        <div class="comment-avatar">
          <q-img :src="row.p_pic"></q-img>
        </div>
        <div class="line"></div>
        <div class="message">
          <div class="text-h6">
            {{ row.p_name}}
          </div>
          <div class="text-subtitle2">
            {{ row.p_reply }}
          </div>
        </div>
      </q-card-section>
      <q-separator dark />
      <q-card-actions>
        <q-form @submit="changeColor">
          <q-card-actions class="comment-btn">
            <q-btn icon="fa-regular fa-thumbs-up" v-if="row.thumb" @click="row.thumb = false, changeColor(row._id)"></q-btn>
            <q-btn icon="fa-solid fa-thumbs-up" v-else @click= "row.thumb = true, changeColor(row._id)"></q-btn>
            <q-btn icon="fa-regular fa-heart" v-if="row.love"  @click="row.love = false, changeColor(row._id)"></q-btn>
            <q-btn icon="fa-solid fa-heart" v-else @click="row.love = true, changeColor(row._id)"></q-btn>
          </q-card-actions>
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
  const { data } = await apiAuth.get('/users/appointmentReplyP')
  rows.push(...data.result)
})()
</script>
