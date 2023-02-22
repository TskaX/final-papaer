<template>
  <div class="q-pa-md" id="setting">
    <q-table
      title="會員管理"
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
        <q-btn icon="fa-solid fa-pen-to-square" @click="openDialog(props.row._id)"></q-btn>
        <q-btn icon="fa-solid fa-eye" @click="openAvailable(1,props.row._id)" v-if="props.row.available === 1"></q-btn>
        <q-btn icon="fa-solid fa-eye-slash" @click="openAvailable(0,props.row._id)" v-else></q-btn>
      </td>
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
  <q-dialog v-model="form.dialog" persistent class="setting-dialog">
    <q-card>
      <q-card-section class="setting-title">
        <div>會員資料修改</div>
      </q-card-section>
      <q-form @submit="submit">
        <q-card-section class="setting-main">
          <div class="row">
            <div class="col-12">姓名
              <q-input outlined v-model="form.name" type="text" :rules="[rules.required]"></q-input>
            </div>
            <div class="col-12">信箱
              <q-input outlined v-model="form.email" type="text" :rules="[rules.required]"></q-input>
            </div>
            <div class="col-12">電話
              <q-input outlined v-model="form.phone" type="text" :rules="[rules.required]"></q-input>
            </div>
            <div class="col-12">生日
              <q-input outlined v-model="form.birth" type="text" :rules="[rules.required]"></q-input>
            </div>
            <div class="col-12">照片
              <br>
              <q-img :src="form.pic"  style="height: 90px; width:140px"></q-img>
              <q-file filled v-model="form.pic" label="連結照片位址"></q-file>
            </div>
          </div>
        </q-card-section>
        <q-card-section class="setting-btn">
          <q-btn type="submit" label="確認" :loading="form.loading"></q-btn>
          <q-btn v-close-popup label="取消" :disabled="form.loading"></q-btn>
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { reactive, ref, computed } from 'vue'
import { apiAuth } from 'src/boot/axios'
import Swal from 'sweetalert2'

const filter = ref('')
const rows = reactive([])

const rules = {
  required (value) {
    return !!value || '欄位必填'
  }
}

const form = reactive({
  _id: '',
  name: '',
  email: '',
  phone: '',
  birth: '',
  pic: undefined,
  dialog: false,
  loading: false
})

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
      rows[index].available = 0
      await apiAuth.patch('/backstages/available/' + formAvailable._id, formAvailable)
    } else {
      formAvailable.available = 1
      rows[index].available = 1
      await apiAuth.patch('/backstages/available/' + formAvailable._id, formAvailable)
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '失敗',
      text: '修改該用戶顯示失敗，請確認錯誤'
    })
  }
}

function openDialog (id) {
  const index = rows.findIndex(el => el._id === id)
  form._id = rows[index]._id
  form.name = rows[index].name
  form.email = rows[index].email
  form.phone = rows[index].phone
  form.birth = rows[index].birth
  form.dialog = true
  form.pic = rows[index].pic
  form.loading = false
}

const submit = async () => {
  form.loading = true
  const fd = new FormData()
  fd.append('name', form.name)
  fd.append('email', form.email)
  fd.append('phone', form.phone)
  fd.append('birth', form.birth)
  fd.append('pic', form.pic)
  try {
    await apiAuth.patch('/backstages/' + form._id, fd)
    Swal.fire({
      icon: 'success',
      title: '成功',
      text: '發問成功等待回復'
    })
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '成功',
      text: '未知問題發生，請聯絡客服'
    })
  }
  form.dialog = false
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
    field: row => '0' + row.phone
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

const pagination = ref({
  sortBy: 'name',
  descending: false,
  page: 1,
  rowsPerPage: 5
})

const pagesNumber = computed(() => {
  return Math.ceil(rows.length / pagination.value.rowsPerPage)
});

(async () => {
  try {
    const { data } = await apiAuth.get('/backstages')
    console.log(data)
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
