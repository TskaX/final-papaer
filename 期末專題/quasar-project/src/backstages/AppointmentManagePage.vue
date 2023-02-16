<template>
  <div class="q-pa-md">
    <q-table
      title="當日預約"
      :rows="rows"
      :columns="columns"
      v-model:pagination="pagination"
      hide-pagination
      :filter="filter"
      row-key="_id"
    >
    <template v-slot:body-cell-pic="props">
      <td>
        <q-img :src="props.row.pic" style="height: 90px"></q-img>
      </td>
    </template>
    <template v-slot:body-cell-button="props">
      <td>
        <q-btn icon="fa-solid fa-wrench" @click="openDialog(props.row._id)"></q-btn>
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

  <div class="q-pa-md">
    <q-table
      title="預約紀錄"
      :rows="rows2"
      :columns="columns"
      v-model:pagination="pagination2"
      hide-pagination
      :filter="filter"
      row-key="_id"
    >
    <template v-slot:body-cell-pic="props">
      <td>
        <q-img :src="props.row.pic" style="height: 90px"></q-img>
      </td>
    </template>
    <template v-slot:body-cell-button="props">
      <td>
        <q-btn icon="fa-solid fa-wrench" @click="openDialog2(props.row._id)"></q-btn>
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
  <q-dialog v-model="form.dialog" persistent>
    <q-card>
      <q-form @submit="submit">
        <q-card-section>
          <div class="row">
            <div class="col-12">會員帳號
              <q-input outlined v-model="form.account" type="text" ></q-input>
            </div>
            <div class="col-12">會員名字
              <q-input outlined v-model="form.name" type="text" ></q-input>
            </div>
            <div class="col-12">預約日期
              <q-input outlined v-model="form.date" type="text" ></q-input>
            </div>
            <div class="col-12">會員時間
              <q-input outlined v-model="form.time" type="text" ></q-input>
            </div>
            <div class="col-12">夥伴名字
              <q-input outlined v-model="form.p_name" type="text" ></q-input>
            </div>
            <div class="col-12">地點
              <q-input outlined v-model="form.place" type="text" ></q-input>
            </div>
            <div class="col-12">
              <q-btn type="submit" label="確認"></q-btn>
              <q-btn v-close-popup label="取消"></q-btn>
            </div>
          </div>
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
  <q-dialog v-model="formDelete.dialog" persistent>
    <q-card>
      <q-card-section>
        <div class="text-h6">你即將刪除該預約</div>
      </q-card-section>
      <q-card-section>
        <q-btn label="確認刪除" @click="deleteMsg()"></q-btn>
        <q-btn label="取消刪除" v-close-popup></q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { reactive, ref, computed } from 'vue'
import { apiAuth } from 'src/boot/axios'
import Swal from 'sweetalert2'

const filter = ref('')
const rows = reactive([])
const rows2 = reactive([])
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
    if (rows[i].done === 0) {
      rows[i].done = '尚未完成'
    } else {
      rows[i].done = '已完成'
    }
  }
}
const changeWordAll = () => {
  for (let i = 0; i <= rows2.length - 1; i++) {
    if (rows2[i].done === 0) {
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

const pagination = ref({
  sortBy: 'name',
  descending: false,
  page: 1,
  rowsPerPage: 4
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

const submit = async () => {
  try {
    await apiAuth.patch('/backstages/appointment/' + form._id, form)
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
};

(async () => {
  try {
    const { data: all } = await apiAuth.get('/backstages/appointment')
    const { data: today } = await apiAuth.get('/backstages/TodayAppointment')
    all.result.reverse()
    today.result.reverse()
    rows.push(...today.result)
    rows2.push(...all.result)
    changeWordToday()
    changeWordAll()
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '失敗',
      text: error?.response?.data?.message || '發生錯誤'
    })
  }
})()

</script>

<style>
</style>
