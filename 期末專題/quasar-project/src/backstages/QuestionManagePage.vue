<template>
  <div id="question-manage">
    <div class="q-pa-md" >
      <q-table
        title="尚未回覆"
        :rows="rows"
        :columns="columns"
        v-model:pagination="pagination"
        hide-pagination
        :filter="filter"
        row-key="_id"
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th auto-width class="text-left">回覆按鈕</q-th>
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
            >
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td auto-width>
              <q-btn size="sm" color="accent" round dense @click="props.expand = !props.expand" :icon="props.expand ? 'remove' : 'add'"/>
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
              <q-form @submit="submit(props.row._id)" @reset="reset(props.row._id)">
                <div class="row">
                  <div class="col-10">
                    <q-input type="text" v-model="props.row.replyContent"  label="回覆"></q-input>
                  </div>
                  <div class="col-2 confirm-btn">
                    <q-btn type="submit" label="確認回覆"></q-btn>
                    <q-btn type="reset" label="取消回覆" @click="props.expand = false"></q-btn>
                  </div>
                </div>
              </q-form>
            </q-td>
          </q-tr>
        </template>
        <template v-slot:top-right>
          <q-input outlined dense debounce="300" v-model="filter" placeholder="Search">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
      </q-table>
      <q-pagination
        v-model="pagination.page"
        color="grey-8"
        :max="pagesNumber"
        size="sm"
      />
    </div>

    <div class="q-pa-md">
      <q-table
        title="已回覆"
        :rows="rows2"
        :columns="columns"
        v-model:pagination="pagination2"
        hide-pagination
        :filter="filter"
        row-key="_id"
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th auto-width class="text-left">回覆內容</q-th>
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
            >
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td auto-width>
              <q-btn size="sm" color="accent" round dense @click="props.expand = !props.expand" :icon="props.expand ? 'remove' : 'add'"/>
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
              <div class="text-left">{{ props.row.replyContent }}</div>
            </q-td>
          </q-tr>
        </template>
        <template v-slot:top-right>
          <q-input outlined dense debounce="300" v-model="filter" placeholder="Search">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
      </q-table>
      <q-pagination
        v-model="pagination2.page"
        color="grey-8"
        :max="pagesNumber2"
        size="sm"
      />
    </div>
  </div>
</template>
<script setup>
import { reactive, ref, computed } from 'vue'
import { apiAuth } from 'src/boot/axios'
import Swal from 'sweetalert2'

const filter = ref('')
const rows = reactive([])
const rows2 = reactive([])

const submit = async (idx) => {
  const index = rows.findIndex(el => el._id === idx)
  rows[index].reply = 1
  try {
    await apiAuth.post('/questions/replyContent/' + rows[index]._id, { replyContent: rows[index].replyContent, reply: rows[index].reply })
    Swal.fire({
      icon: 'success',
      title: '成功',
      text: '回覆成功'
    })
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '失敗',
      text: '回覆失敗'
    })
  }
}

const reset = (idx) => {
  const index = rows.findIndex(el => el._id === idx)
  rows[index].replyContent = ''
}

const columns = reactive([
  {
    name: 'member_name',
    label: '會員名字',
    align: 'left',
    field: row => row.u_id.account
  },
  {
    name: 'title',
    label: '主旨',
    align: 'left',
    field: row => row.title
  },
  {
    name: 'content',
    label: '內容',
    align: 'left',
    field: row => row.content
  },
  {
    name: 'time',
    label: '聯絡時間',
    align: 'left',
    field: row => row.time
  },
  {
    name: 'phone',
    label: '電話',
    align: 'left',
    field: row => '0' + row.u_id.phone
  }
])

const pagination = ref({
  sortBy: 'name',
  descending: false,
  page: 1,
  rowsPerPage: 5
})

const pagesNumber = computed(() => {
  return Math.ceil(rows.length / pagination.value.rowsPerPage)
})

const pagination2 = ref({
  sortBy: 'name',
  descending: false,
  page: 1,
  rowsPerPage: 5
})

const pagesNumber2 = computed(() => {
  return Math.ceil(rows2.length / pagination2.value.rowsPerPage)
});

(async () => {
  try {
    const { data: none } = await apiAuth.get('/questions/none')
    const { data: done } = await apiAuth.get('/questions/done')
    none.result.reverse()
    done.result.reverse()
    rows.push(...none.result)
    rows2.push(...done.result)
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '失敗',
      text: error?.response?.data?.message || '發生錯誤'
    })
  }
})()

</script>
