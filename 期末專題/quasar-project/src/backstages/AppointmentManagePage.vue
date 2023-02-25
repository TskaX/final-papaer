<template>
  <div id="appointment-manage">
    <q-btn class="today add" label="當日預約" @click="openAppointment(1)"></q-btn>
    <q-btn class="done add" label="所有預約" @click="openAppointment(0)"></q-btn>
    <q-btn class="reply-check add" label="留言紀錄" @click="openAppointment(-1)"></q-btn>
    <div class="q-pa-md today-appointment" >
      <q-table
        title="預約管理 - 當日預約"
        :rows="rows"
        :columns="columns"
        v-model:pagination="pagination"
        hide-pagination
        :filter="filter"
        row-key="_id"
      >
      <template v-slot:top-right>
        <q-input outlined dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:body-cell-button="props">
        <td>
          <q-btn icon="fa-solid fa-pen-to-square" @click="openDialog(props.row._id)" v-if="props.row.done !== '已完成'"></q-btn>
          <q-btn icon="fa-solid fa-pen-to-square" v-if="props.row.done !=='尚未完成'" style="color:white" disable></q-btn>
          <q-btn icon="fa-solid fa-trash" @click="openDelete(props.row._id)"></q-btn>
        </td>
      </template>
      </q-table>
      <q-pagination
        v-model="pagination.page"
        color="grey-8"
        :max="pagesNumber"
        size="sm"
      />
    </div>

    <div class="q-pa-md all-appointment">
      <q-table
        title="預約管理 - 所有預約"
        :rows="rows2"
        :columns="columns"
        v-model:pagination="pagination2"
        hide-pagination
        :filter="filter"
        row-key="_id"
      >
      <template v-slot:top-right>
        <q-input outlined dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:body-cell-button="props">
        <td>
          <q-btn icon="fa-solid fa-pen-to-square" @click="openDialog2(props.row._id)" v-if="props.row.done !=='已完成'"></q-btn>
          <q-btn icon="fa-solid fa-pen-to-square" v-if="props.row.done !=='尚未完成'" style="color:white;" disable></q-btn>
          <q-btn icon="fa-solid fa-trash" @click="openDelete2(props.row._id)"></q-btn>
        </td>
      </template>
      </q-table>
      <q-pagination
        v-model="pagination2.page"
        color="grey-8"
        :max="pagesNumber2"
        size="sm"
      />
    </div>

    <div class="q-pa-md all-reply">
      <q-table
        title="預約管理 - 留言紀錄"
        :rows="rows3"
        :columns="columns2"
        v-model:pagination="pagination3"
        hide-pagination
        :filter="filter"
        row-key="_id"
      >
      <template v-slot:top-right>
        <q-input outlined dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:body-cell-button="props">
        <td>
          <q-btn icon="fa-solid fa-pen-to-square" @click="openReply(props.row._id)"></q-btn>
        </td>
      </template>
      </q-table>
      <q-pagination
        v-model="pagination3.page"
        color="grey-8"
        :max="pagesNumber3"
        size="sm"
      />
    </div>
    <q-dialog v-model="form.dialog" persistent class="appointmentManage-dialog">
      <q-card>
        <q-card-section class="appointmentManage-title">
          <div>修改預約資料</div>
        </q-card-section>
        <q-form @submit="submit">
          <q-card-section class="appointmentManage-main">
            <div class="row">
              <div class="col-12">會員帳號
                <q-input outlined v-model="form.account" type="text" :rules="[rules.required]" disable></q-input>
              </div>
              <div class="col-12">會員名字
                <q-input outlined v-model="form.name" type="text" :rules="[rules.required]" disable></q-input>
              </div>
              <div class="col-12">預約日期
                <q-input outlined v-model="form.date" type="text" :rules="[rules.required]"></q-input>
              </div>
              <div class="col-12">會員時間
                <q-input outlined v-model="form.time" type="text" :rules="[rules.required]"></q-input>
              </div>
              <div class="col-12">夥伴名字
                <q-input outlined v-model="form.p_name" type="text" :rules="[rules.required]"></q-input>
              </div>
              <div class="col-12">地點
                <q-input outlined v-model="form.place" type="text" :rules="[rules.required]"></q-input>
              </div>
            </div>
          </q-card-section>
          <q-card-section class="appointmentManage-btn">
            <q-btn type="submit" label="確認"></q-btn>
            <q-btn v-close-popup label="取消"></q-btn>
          </q-card-section>
        </q-form>
      </q-card>
    </q-dialog>
    <q-dialog v-model="formDelete.dialog" persistent class="appointmentDelete-dialog">
      <q-card>
        <q-card-section class="appointmentDelete-title">
          <div class="text-h6">你即將刪除該預約</div>
        </q-card-section>
        <q-card-section class="appointmentDelete-btn">
          <q-btn label="確認刪除" @click="deleteMsg()"></q-btn>
          <q-btn label="取消刪除" v-close-popup></q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="formReply.dialog" persistent class="appointmentManage-dialog">
      <q-card>
        <q-card-section class="appointmentManage-title">
          <div>編輯留言</div>
        </q-card-section>
        <q-form @submit="submitReply">
          <q-card-section class="appointmentManage-main">
            <div class="row">
              <div class="col-12">會員留言
                <q-input outlined v-model="formReply.u_reply" type="text"></q-input>
              </div>
              <div class="col-12">夥伴留言
                <q-input outlined v-model="formReply.p_reply" type="text"></q-input>
              </div>
            </div>
          </q-card-section>
          <q-card-section class="appointmentManage-btn">
            <q-btn type="submit" label="確認"></q-btn>
            <q-btn v-close-popup label="取消"></q-btn>
          </q-card-section>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>
<script setup>
import { reactive, ref, computed } from 'vue'
import { apiAuth } from 'src/boot/axios'
import Swal from 'sweetalert2'

const rules = {
  required (value) {
    return !!value || '欄位必填'
  }
}

const openAppointment = (idx) => {
  const todayAppointment = document.querySelector('.today-appointment')
  const allAppointment = document.querySelector('.all-appointment')
  const allReply = document.querySelector('.all-reply')
  if (idx === 0) {
    todayAppointment.style.cssText = 'display: none'
    allAppointment.style.cssText = 'display: block'
    allReply.style.cssText = 'display: none'
  } else if (idx === 1) {
    todayAppointment.style.cssText = 'display: block'
    allAppointment.style.cssText = 'display: none'
    allReply.style.cssText = 'display: none'
  } else {
    todayAppointment.style.cssText = 'display: none'
    allAppointment.style.cssText = 'display: none'
    allReply.style.cssText = 'display: block'
  }
}

const filter = ref('')
const rows = reactive([])
const rows2 = reactive([])
let rows3 = reactive([])

const form = reactive({
  _id: '',
  a_date: '',
  account: '',
  name: '',
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

const formReply = reactive({
  dialog: false,
  u_reply: '',
  p_reply: '',
  _id: ''
})

const openDelete = (id) => {
  formDelete.dialog = true
  const index = rows.findIndex(el => el._id === id)
  formDelete._id = rows[index]._id
}

const openDelete2 = (id) => {
  formDelete.dialog = true
  const index = rows2.findIndex(el => el._id === id)
  formDelete._id = rows2[index]._id
}

const changeWordToday = () => {
  for (let i = 0; i <= rows.length - 1; i++) {
    if (rows[i].done === 1) {
      rows[i].done = '尚未完成'
    } else {
      rows[i].done = '已完成'
    }
  }
}

const changeWordAll = () => {
  for (let i = 0; i <= rows2.length - 1; i++) {
    if (rows2[i].done === 1) {
      rows2[i].done = '尚未完成'
    } else {
      rows2[i].done = '已完成'
    }
  }
}

const columns = reactive([
  {
    name: 'date',
    label: '預約紀錄日期',
    align: 'left',
    field: row => row.a_date.substring(0, 10)
  },
  {
    name: 'member_account',
    label: '會員帳號',
    align: 'left',
    field: row => row.account
  },
  {
    name: 'member_name',
    label: '會員名字',
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
  },
  {
    name: 'status',
    label: '預約狀況',
    align: 'left',
    field: row => row.done
  },
  {
    name: 'button',
    label: '',
    align: 'left'
  }
])

const columns2 = reactive([
  {
    name: 'date',
    label: '預約紀錄日期',
    align: 'left',
    field: row => row.a_date.substring(0, 10)
  },
  {
    name: 'member_account',
    label: '會員帳號',
    align: 'left',
    field: row => row.account
  },
  {
    name: 'member_name',
    label: '會員名字',
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
    name: 'p_name',
    label: '夥伴名字',
    align: 'left',
    field: row => row.p_name
  },
  {
    name: 'u_reply',
    label: '會員留言',
    align: 'left',
    field: row => row.u_reply
  },
  {
    name: 'p_reply',
    label: '夥伴留言',
    align: 'left',
    field: row => row.p_reply
  },
  {
    name: 'button',
    label: '',
    align: 'left'
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

const pagination2 = ref({
  sortBy: 'name',
  descending: false,
  page: 1,
  rowsPerPage: 10
})

const pagesNumber2 = computed(() => {
  return Math.ceil(rows2.length / pagination2.value.rowsPerPage)
})

const pagination3 = ref({
  sortBy: 'name',
  descending: false,
  page: 1,
  rowsPerPage: 10
})

const pagesNumber3 = computed(() => {
  return Math.ceil(rows3.length / pagination3.value.rowsPerPage)
})

const openDialog = (id) => {
  const index = rows.findIndex(el => el._id === id)
  form._id = rows[index]._id
  form.a_date = rows[index].a_date
  form.name = rows[index].name
  form.account = rows[index].account
  form.date = rows[index].date
  form.time = rows[index].time
  form.p_name = rows[index].p_name
  form.place = rows[index].place
  form.dialog = true
}

const openDialog2 = (id) => {
  const index = rows2.findIndex(el => el._id === id)
  form._id = rows2[index]._id
  form.a_date = rows2[index].a_date
  form.name = rows2[index].name
  form.account = rows2[index].account
  form.date = rows2[index].date
  form.time = rows2[index].time
  form.p_name = rows2[index].p_name
  form.place = rows2[index].place
  form.dialog = true
}

const openReply = (id) => {
  const index = rows3.findIndex(el => el._id === id)
  formReply._id = rows3[index]._id
  formReply.u_reply = rows3[index].u_reply
  formReply.p_reply = rows3[index].p_reply
  formReply.dialog = true
}

const submit = async () => {
  try {
    const index = rows.findIndex(el => el._id === form._id)
    const index2 = rows2.findIndex(el => el._id === form._id)
    const { data } = await apiAuth.patch('/backstages/appointment/' + form._id, form)
    rows[index] = data.result
    rows2[index2] = data.result
    changeWordAll()
    Swal.fire({
      icon: 'success',
      title: '成功',
      text: '編輯預約成功'
    })
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '失敗',
      text: '編輯預約失敗'
    })
  }
  form.dialog = false
}

const deleteMsg = async () => {
  const index = rows.findIndex(el => el._id === formDelete._id)
  const index2 = rows2.findIndex(el => el._id === formDelete._id)
  try {
    await apiAuth.patch('/backstages/appointmentDelete/' + formDelete._id, formDelete)
    rows.splice(index, 1)
    rows2.splice(index2, 1)
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

const submitReply = async () => {
  const index3 = rows3.findIndex(el => el._id === formReply._id)
  try {
    const { data } = await apiAuth.patch('/backstages/editReply/' + formReply._id, formReply)
    rows3[index3].u_reply = data.result.u_reply
    rows3[index3].p_reply = data.result.p_reply
    Swal.fire({
      icon: 'success',
      title: '成功',
      text: '編輯留言成功'
    })
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '失敗',
      text: '編輯留言失敗'
    })
  }
  formReply.dialog = false
};

(async () => {
  try {
    const { data: all } = await apiAuth.get('/backstages/appointment')
    const { data: today } = await apiAuth.get('/backstages/TodayAppointment')
    const { data: replyCheck } = await apiAuth.get('/backstages/appointment')
    all.result.reverse()
    today.result.reverse()
    replyCheck.result.reverse()
    rows.push(...today.result)
    rows2.push(...all.result)
    rows3.push(...replyCheck.result)
    rows3 = rows3.filter(el => el.done === 2)
    changeWordToday()
    changeWordAll()
    console.log(rows3)
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '失敗',
      text: error?.response?.data?.message || '發生錯誤'
    })
  }
})()

</script>
