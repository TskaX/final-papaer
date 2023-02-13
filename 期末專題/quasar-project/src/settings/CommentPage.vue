<template>
  <div class="q-pa-md">
    <q-table
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="_id"
    >

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-btn size="sm" color="accent" round dense @click="props.expand = !props.expand" :icon="props.expand ? 'remove' : 'add'" />
          </q-td>
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.value }}
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <div class="text-left">This is expand slot for row above: {{ props.cols.name }}.</div>
          </q-td>
        </q-tr>
      </template>

    </q-table>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { apiAuth } from 'src/boot/axios'
import Swal from 'sweetalert2'

const rows = reactive([])

const columns = [
  {
    name: 'title',
    label: 'title',
    align: 'left',
    field: row => row.title
  },
  {
    name: 'time',
    label: 'time',
    align: 'left',
    field: row => row.time
  },
  {
    name: 'content',
    label: 'content',
    align: 'left',
    field: row => row.content
  },
  {
    name: 'reply',
    label: 'reply',
    align: 'right',
    field: row => row.reply
  }
];

(async () => {
  try {
    const { data } = await apiAuth.get('/questions/all')
    rows.push(...data.result)
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '失敗',
      text: error?.response?.data?.message || '發生錯誤'
    })
  }
})()
</script>
