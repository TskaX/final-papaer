<template>
  <div id="appointment">
    <div class="q-pa-md">
      <q-table
        title="預約紀錄"
        :rows="rows"
        :columns="columns"
        v-model:pagination="pagination"
        hide-pagination
        :filter="filter"
        row-key="_id"
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th auto-width class="text-left">預約狀況</q-th>
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
            >
              {{ col.label }}
            </q-th>
            <q-th auto-width class="text-left"></q-th>
            <q-th auto-width class="text-left">給小夥伴回覆</q-th>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
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
            <td>
              <q-btn icon="fa-solid fa-pen-to-square" @click="openDialog(props.row._id)" v-if="props.row.done === '確認後，請送出'"></q-btn>
              <q-btn icon="fa-solid fa-trash" @click="openDelete(props.row._id)" v-if="props.row.done === '確認後，請送出'"></q-btn>
            </td>
            <q-td auto-width>
              <q-btn size="sm" color="accent" round dense @click="props.expand = !props.expand" :icon="props.expand ? 'remove' : 'add'" v-if=showMessage(props.row.done) />
            </q-td>
          </q-tr>
          <q-tr v-show="props.expand" :props="props">
            <q-td  colspan="100%" v-if="props.row.u_replyStatus === 1">
              {{ props.row.u_reply  }}
            </q-td>
            <q-td colspan="100%" v-else>
              <q-form @submit="submitAppointment(props.row._id)" @reset="reset(props.row._id)">
                <div class="row">
                  <div class="col-10">
                    <q-input type="text" v-model="props.row.u_reply" label="回覆"></q-input>
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
    <q-dialog v-model="form.dialog" persistent class="appointment-dialog">
      <q-card>
        <q-card-section class="appointment-title">
          <div>
            預約確認
          </div>
        </q-card-section>
        <q-form @submit="submit">
          <q-card-section class="appointment-main">
            <div class="row">
              <div class="col-12">會員帳號
                <q-input outlined v-model="form.account" type="text" disable></q-input>
              </div>
              <div class="col-12">預約日期
                <q-input outlined v-model="form.date" type="text" :rules="[rules.required]"></q-input>
              </div>
              <div class="col-12">會員時間
                <q-input outlined v-model="form.time" type="text" :rules="[rules.required]"></q-input>
              </div>
              <div class="col-12">夥伴名字
                <q-input outlined v-model="form.p_name" type="text" disable></q-input>
              </div>
              <div class="col-12">地點
                <q-input outlined v-model="form.place" type="text" :rules="[rules.required]"></q-input>
              </div>
            </div>
          </q-card-section>
          <q-card-section class="appointment-btn">
                <q-btn type="submit" label="確認"></q-btn>
                <q-btn v-close-popup label="取消"></q-btn>
              </q-card-section>
        </q-form>
      </q-card>
    </q-dialog>
    <q-dialog v-model="formDelete.dialog" persistent class="deleteAppointment-dialog">
      <q-card>
        <q-card-section class="deleteAppointment-title">
          <div>你即將刪除該消息</div>
        </q-card-section>
        <q-card-section class="deleteAppointment-btn">
          <q-btn label="確認刪除" @click="deleteMsg()"></q-btn>
          <q-btn label="取消刪除" v-close-popup></q-btn>
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
  if (reply === '預約結束') {
    return true
  } else {
    return false
  }
}
const test = () => {
  for (let i = 0; i <= rows.length - 1; i++) {
    if (rows[i].done === 0) {
      rows[i].done = '確認後，請送出'
    } else if (rows[i].done === 1) {
      rows[i].done = '預約成功'
    } else {
      rows[i].done = '預約結束'
    }
  }
}

const rules = {
  required (value) {
    return !!value || '欄位必填'
  }
}

const columns = reactive([
  {
    name: 'account',
    label: '帳號',
    align: 'left',
    field: row => row.account
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
    name: 'p_name',
    label: '夥伴名字',
    align: 'left',
    field: row => row.p_name
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

const form = reactive({
  _id: '',
  account: '',
  date: '',
  time: '',
  p_name: '',
  place: '',
  done: '',
  dialog: false
})

const formDelete = reactive({
  dialog: false,
  time: '',
  date: '',
  place: '',
  _id: ''
})

const openDelete = (id) => {
  formDelete.dialog = true
  const index = rows.findIndex(el => el._id === id)
  formDelete._id = rows[index]._id
}

const openDialog = (id) => {
  const index = rows.findIndex(el => el._id === id)
  form._id = rows[index]._id
  form.account = rows[index].account
  form.date = rows[index].date
  form.time = rows[index].time
  form.p_name = rows[index].p_name
  form.place = rows[index].place
  form.dialog = true
}

const submit = async () => {
  try {
    form.done = 1
    await apiAuth.patch('/users/appointment/' + form._id, form)
    Swal.fire({
      icon: 'success',
      title: '成功',
      text: '預約成功'
    })
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '失敗',
      text: '預約失敗'
    })
  }
  form.dialog = false
}

const deleteMsg = async () => {
  try {
    await apiAuth.patch('/backstages/appointmentDelete/' + formDelete._id, formDelete)
    Swal.fire({
      icon: 'success',
      title: '成功',
      text: '刪除預約成功'
    })
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '失敗',
      text: '刪除預約失敗'
    })
  }
  formDelete.dialog = false
}

const submitAppointment = async (idx) => {
  const index = rows.findIndex(el => el._id === idx)
  rows[index].u_replyStatus = 1
  try {
    await apiAuth.post('/users/replyAppointment/' + rows[index]._id, { u_reply: rows[index].u_reply, u_replyStatus: rows[index].u_replyStatus })
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
};

(async () => {
  try {
    const { data } = await apiAuth.get('/users/appointment')
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
