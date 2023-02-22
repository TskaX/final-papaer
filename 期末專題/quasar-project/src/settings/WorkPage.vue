<template>
  <div id="work">
    <div class="q-pa-md">
      <q-table
        title="工作預約紀錄"
        :rows="rows"
        :columns="columns"
        v-model:pagination="pagination"
        hide-pagination
        :filter="filter"
        row-key="_id"
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th auto-width class="text-left">完成按鈕</q-th>
            <q-th auto-width class="text-left">預約狀況</q-th>
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
            >
              {{ col.label }}
            </q-th>
            <q-th auto-width class="text-left">給用戶留言</q-th>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td>
              <q-btn icon="fa-solid fa-check" @click="openFinish(props.row._id)" v-if="props.row.done === '待辦預約'"></q-btn>
            </q-td>
            <q-td>
              {{ props.row.done }}
            </q-td>
            <q-td
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
            >
              {{ col.value }}
            </q-td>
            <q-td auto-width>
              <q-btn size="sm" color="accent" round dense @click="props.expand = !props.expand" :icon="props.expand ? 'remove' : 'add'" v-if=showMessage(props.row.done) />
            </q-td>
          </q-tr>
          <q-tr v-show="props.expand" :props="props">
            <q-td colspan="100%" v-if="props.row.p_replyStatus === 1">
              {{ props.row.p_reply  }}
            </q-td>
            <q-td colspan="100%" v-else>
              <q-form @submit="submitAppointment(props.row._id)" @reset="reset(props.row._id)">
                <div class="row">
                  <div class="col-10">
                    <q-input type="text" v-model="props.row.p_reply" label="回覆"></q-input>
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
    <q-dialog v-model="formDone.dialog" persistent class="work-dialog">
      <q-card>
        <q-card-section class="work-title">
          <div>你確定完成該預約?</div>
        </q-card-section>
        <q-card-section class="work-btn">
          <q-btn label="確認完成" @click="finishAppointment()"></q-btn>
          <q-btn label="尚未完成" v-close-popup></q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { apiAuth } from 'src/boot/axios'
import Swal from 'sweetalert2'

const filter = ref('')
const rows = reactive([])
const showMessage = (reply) => {
  if (reply === '已結束') {
    return true
  } else {
    return false
  }
}
const test = () => {
  for (let i = 0; i <= rows.length - 1; i++) {
    if (rows[i].done === 1) {
      rows[i].done = '待辦預約'
    } else {
      rows[i].done = '已結束'
    }
  }
}

const columns = reactive([
  {
    name: 'name',
    label: '會員姓名',
    align: 'left',
    field: row => row.name
  },
  {
    name: 'date',
    label: '預約日期',
    align: 'left',
    field: row => row.date
  },
  {
    name: 'time',
    label: '預約時間',
    align: 'left',
    field: row => row.time
  },
  {
    name: 'phone',
    label: '電話',
    align: 'left',
    field: row => 0 + row.phone
  },
  {
    name: 'place',
    label: '地點',
    align: 'left',
    field: row => row.place
  }
])

const pagination = ref({
  sortBy: 'name',
  descending: false,
  page: 1,
  rowsPerPage: 10
})

const pagesNumber = computed(() => {
  return Math.ceil(rows.length / pagination.value.rowsPerPage)
})

const submitAppointment = async (idx) => {
  const index = rows.findIndex(el => el._id === idx)
  rows[index].p_replyStatus = 1
  try {
    await apiAuth.post('/users/replyMember/' + rows[index]._id, { p_reply: rows[index].p_reply, p_replyStatus: rows[index].p_replyStatus })
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
  rows[index].u_reply = ''
}

const formDone = reactive({
  dialog: false,
  done: '',
  _id: ''
})

const openFinish = (id) => {
  formDone.dialog = true
  const index = rows.findIndex(el => el._id === id)
  formDone._id = rows[index]._id
}

const finishAppointment = async () => {
  try {
    formDone.done = 2
    await apiAuth.patch('/users/finishAppointment/' + formDone._id, formDone)
    Swal.fire({
      icon: 'success',
      title: '成功',
      text: '完成預約'
    })
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '失敗',
      text: '完成預約失敗'
    })
  }
  formDone.dialog = false
}

(async () => {
  try {
    const { data } = await apiAuth.get('/users/workAppointment')
    data.result.reverse()
    rows.push(...data.result)
    test()
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '失敗',
      text: error?.response?.data?.message || '發生錯誤'
    })
  }
})()

</script>
