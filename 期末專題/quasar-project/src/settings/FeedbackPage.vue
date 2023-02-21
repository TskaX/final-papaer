<template>
  <div id="feedback">
    <div class="q-pa-md row items-start q-gutter-md">
      <div class="title col-12">會員反饋</div>
      <q-card class="my-card text-black col-11 col-md-5" v-for="row in rows" :key="row._id">
        <q-card-section class="feedback-main">
          <div class="feedback-avatar">
            <q-img :src="row.p_pic"></q-img>
          </div>
          <div class="line"></div>
          <div class="message">
            <div class="text-h6 text-bold">
              {{ row.name}}
            </div>
            <div class="text-subtitle2">
              {{ row.u_reply }}
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
<script setup>
import { apiAuth } from 'src/boot/axios'
import { reactive } from 'vue'

const rows = reactive([]);

(async () => {
  const { data } = await apiAuth.get('/users/appointmentReply')
  rows.push(...data.result)
})()
</script>
