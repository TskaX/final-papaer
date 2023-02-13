<template>
  <q-btn label="新增夥伴" @click="openDialog(0)"></q-btn>
  <div class="q-pa-md">
    <q-table
      title="夥伴管理"
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
        <q-btn icon="fa-solid fa-wrench" @click="openDialog(1,props.row._id)"></q-btn>
        <q-btn icon="fa-solid fa-eye" @click="openAvailable(1,props.row._id)" v-if="props.row.available === 1"></q-btn>
        <q-btn icon="fa-solid fa-eye-slash" @click="openAvailable(0,props.row._id)" v-else></q-btn>
      </td>
    </template>
    <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
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
  <q-dialog v-model="form.dialog" persistent>
    <q-card>
      <q-form @submit="submit">
        <q-card-section>
          <div class="row">
            <div class="col-12">帳號
              <q-input v-model="form.account" type="text" ></q-input>
            </div>
            <div class="col-12" v-if="form._id.length === 0">密碼
              <q-input v-model="form.password" type="text" ></q-input>
            </div>
            <div class="col-12">姓名
              <q-input v-model="form.name" type="text" ></q-input>
            </div>
            <div class="col-12">信箱
              <q-input v-model="form.email" type="text" ></q-input>
            </div>
            <div class="col-12">電話
              <q-input v-model="form.phone" type="text" ></q-input>
            </div>
            <div class="col-12">生日
              <q-input v-model="form.birth" type="text" ></q-input>
            </div>
            <div class="col-12">照片
              <br>
              <q-img :src="form.pic"  style="height: 90px; width:140px"></q-img>
              <q-file v-model="form.pic"></q-file>
            </div>
            <div class="col-12">
              <q-btn type="submit" label="確認" :loading="form.loading"></q-btn>
              <q-btn v-close-popup label="取消" :disabled="form.loading"></q-btn>
            </div>
          </div>
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { apiAuth } from 'src/boot/axios'
import Swal from 'sweetalert2'
import { reactive, ref, computed } from 'vue'

const filter = ref('')
const rows = reactive([])

const form = reactive({
  _id: '',
  account: '',
  password: '',
  name: '',
  email: '',
  phone: '',
  birth: '',
  pic: undefined,
  dialog: false,
  partner: 1,
  loading: false
})
const openDialog = (idx, id) => {
  const index = rows.findIndex(el => el._id === id)
  if (idx === 0) {
    form.account = ''
    form._id = ''
    form.password = ''
    form.name = ''
    form.email = ''
    form.phone = ''
    form.birth = ''
    form.pic = undefined
    form.dialog = true
    form.loading = false
  } else {
    form.account = rows[index].account
    form._id = rows[index]._id
    form.name = rows[index].name
    form.email = rows[index].email
    form.phone = rows[index].phone
    form.birth = rows[index].birth
    form.pic = rows[index].pic
    form.dialog = true
    form.loading = false
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
    name: 'name',
    label: '姓名',
    align: 'left',
    field: row => row.name
  },
  {
    name: 'email',
    label: '信箱',
    align: 'left',
    field: row => row.email
  },
  {
    name: 'phone',
    label: '電話',
    align: 'left',
    field: row => row.phone
  },
  {
    name: 'birth',
    label: '生日',
    align: 'left',
    field: row => row.birth
  },
  {
    name: 'pic',
    label: '照片',
    align: 'left'
  },
  {
    name: 'button',
    label: '',
    align: 'left'
  }
])

const formAvailable = reactive({
  _id: '',
  available: ''
})

const openAvailable = async (idx, id) => {
  const index = rows.findIndex(el => el._id === id)
  formAvailable._id = rows[index]._id
  try {
    if (idx === 1) {
      formAvailable.available = 0
      await apiAuth.patch('/backstages/available/' + formAvailable._id, formAvailable)
      Swal.fire({
        icon: 'success',
        title: '成功',
        text: '修改該用戶顯示成功，請重新整理頁面'
      })
    } else {
      formAvailable.available = 1
      await apiAuth.patch('/backstages/available/' + formAvailable._id, formAvailable)
      Swal.fire({
        icon: 'success',
        title: '成功',
        text: '修改該用戶顯示成功，請重新整理頁面'
      })
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '失敗',
      text: '修改該用戶顯示失敗，請確認錯誤'
    })
  }
}

const submit = async () => {
  form.loading = true

  const fd = new FormData()
  fd.append('account', form.account)
  fd.append('password', form.password)
  fd.append('name', form.name)
  fd.append('email', form.email)
  fd.append('phone', form.phone)
  fd.append('birth', form.birth)
  fd.append('pic', form.pic)
  fd.append('partner', form.partner)
  try {
    if (form._id.length === 0) {
      const { data } = await apiAuth.post('/users/partner', fd)
      rows.push(data.result)
      Swal.fire({
        icon: 'success',
        title: '成功',
        text: '新增成功'
      })
    } else {
      const { data } = await apiAuth.patch('/users/partner/' + form._id, fd)
      rows[form.idx] = data.result
      Swal.fire({
        icon: 'success',
        title: '成功',
        text: '編輯成功'
      })
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '失敗',
      text: '新增/編輯失敗'
    })
  }
  form.dialog = false
}

const pagination = ref({
  sortBy: 'name',
  descending: false,
  page: 1,
  rowsPerPage: 10
})

const pagesNumber = computed(() => {
  return Math.ceil(rows.length / pagination.value.rowsPerPage)
});

(async () => {
  try {
    const { data } = await apiAuth.get('/backstages/partner')
    rows.push(...data.result)
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '失敗',
      text: '取得夥伴資料失敗'
    })
  }
})()
</script>
