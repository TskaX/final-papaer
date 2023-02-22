<template>
  <div id="partner">
    <div class="q-pa-md">
      <q-btn label="新增夥伴" @click="openDialog(0)" class="add"></q-btn>
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
          <q-btn icon="fa-solid fa-pen-to-square" @click="openDialog(1,props.row._id)"></q-btn>
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
    <q-dialog v-model="form.dialog" persistent class="partner-dialog">
      <q-card>
        <q-card-section class="partner-title">
          <div v-if="form._id.length === 0">夥伴資料新增</div>
          <div v-else>夥伴資料修改</div>
        </q-card-section>
        <q-form @submit="submit">
          <q-card-section class="partner-main">
            <div class="row">
              <div class="col-5" v-if="form._id.length === 0">帳號
                <q-input outlined v-model="form.account" type="text" :rules="[rules.required]"></q-input>
              </div>
              <div class="col-1" v-if="form._id.length === 0"></div>
              <div class="col-5" v-if="form._id.length === 0">密碼
                <q-input outlined v-model="form.password" type="text" :rules="[rules.required]"></q-input>
              </div>
              <div class="col-5">姓名
                <q-input outlined v-model="form.name" type="text" :rules="[rules.required]"></q-input>
              </div>
              <div class="col-1"></div>
              <div class="col-5">電話
                <q-input outlined v-model="form.phone" type="text" :rules="[rules.required]"></q-input>
              </div>
              <div class="col-5">生日
                <q-input outlined v-model="form.birth" type="text" :rules="[rules.required]"></q-input>
              </div>
              <div class="col-1"></div>
              <div class="col-5">個性
                <q-input outlined v-model="form.personal" type="text" :rules="[rules.required]"></q-input>
              </div>
              <div class="col-5">興趣
                <q-input outlined v-model="form.hobby" type="text" :rules="[rules.required]"></q-input>
              </div>
              <div class="col-1"></div>
              <div class="col-5">給會員的一句話
                <q-input outlined v-model="form.word" type="text" :rules="[rules.required]"></q-input>
              </div>
              <div class="col-11">信箱
                <q-input outlined v-model="form.email" type="text" :rules="[rules.required]"></q-input>
              </div>
              <div class="col-11">照片
                <br>
                <q-img :src="form.pic"  style="height: 90px; width:140px"></q-img>
                <q-file filled v-model="form.pic" label="連結照片位址"></q-file>
              </div>
            </div>
          </q-card-section>
          <q-card-section class="partner-btn">
            <q-btn type="submit" label="確認" :loading="form.loading"></q-btn>
            <q-btn v-close-popup label="取消" :disabled="form.loading"></q-btn>
          </q-card-section>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>
<script setup>
import { apiAuth } from 'src/boot/axios'
import Swal from 'sweetalert2'
import { reactive, ref, computed } from 'vue'

const filter = ref('')
const rows = reactive([])

const rules = {
  required (value) {
    return !!value || '欄位必填'
  }
}

const form = reactive({
  _id: '',
  account: '',
  password: '',
  name: '',
  email: '',
  phone: '',
  birth: '',
  word: '',
  hobby: '',
  personal: '',
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
    form.word = ''
    form.hobby = ''
    form.personal = ''
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
    form.word = rows[index].word
    form.hobby = rows[index].hobby
    form.personal = rows[index].personal
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
    name: 'birth',
    label: '生日',
    align: 'left',
    field: row => row.birth
  },
  {
    name: 'phone',
    label: '電話',
    align: 'left',
    field: row => row.phone
  },
  {
    name: 'personal',
    label: '個性',
    align: 'left',
    field: row => row.personal
  },
  {
    name: 'hobby',
    label: '興趣',
    align: 'left',
    field: row => row.hobby
  },
  {
    name: 'word',
    label: '給會員的話',
    align: 'left',
    field: row => row.word
  },
  {
    name: 'email',
    label: '信箱',
    align: 'left',
    field: row => row.email
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
  fd.append('word', form.word)
  fd.append('hobby', form.hobby)
  fd.append('personal', form.personal)
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
  rowsPerPage: 5
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
