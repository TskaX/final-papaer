<template>
  <q-btn label="新增訊息" @click="openDialog(0)"></q-btn>

  <div class="q-pa-md">
    <q-table
      title="頁面消息管理"
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
        <q-btn icon="fa-solid fa-trash" @click="openDelete(props.row._id)"></q-btn>
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
            <div class="col-12">主題
              <q-input outlined v-model="form.title" type="text" ></q-input>
            </div>
            <div class="col-12">內容
              <q-input outlined type="textarea" v-model="form.content"></q-input>
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
        <div class="text-h6">你即將刪除該消息</div>
      </q-card-section>
      <q-card-section>
        <q-btn label="確認刪除" @click="deleteMsg()"></q-btn>
        <q-btn label="取消刪除" v-close-popup></q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { apiAuth } from 'src/boot/axios'
import Swal from 'sweetalert2'
import { reactive, ref, computed } from 'vue'

const date = new Date()
const day = date.getDate()
const month = date.getMonth() + 1
const rows = reactive([])
const filter = ref('')

const columns = reactive([
  {
    name: 'date',
    label: '日期',
    align: 'left',
    field: row => row.date
  },
  {
    name: 'title',
    label: '主題',
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

const form = reactive({
  _id: '',
  date: '',
  title: '',
  content: '',
  dialog: false
})
const openDialog = (idx, id) => {
  const index = rows.findIndex(el => el._id === id)
  if (idx === 0) {
    form._id = ''
    form.title = ''
    form.content = ''
    form.dialog = true
  } else {
    form._id = rows[index]._id
    form.title = rows[index].title
    form.content = rows[index].content
    form.dialog = true
  }
}
const submit = async () => {
  try {
    form.date = `${month}月${day}日`
    if (form._id.length === 0) {
      await apiAuth.post('/backstages/messages', form)
      Swal.fire({
        icon: 'success',
        title: '成功',
        text: '新增消息成功'
      })
    } else {
      await apiAuth.patch('/backstages/messages/' + form._id, form)
      Swal.fire({
        icon: 'success',
        title: '成功',
        text: '編輯消息成功'
      })
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '失敗',
      text: '新增消息失敗'
    })
  }
  form.dialog = false
}
const formDelete = reactive({
  dialog: false,
  content: '',
  title: '',
  _id: ''
})

const openDelete = (id) => {
  formDelete.dialog = true
  const index = rows.findIndex(el => el._id === id)
  formDelete._id = rows[index]._id
}

const deleteMsg = async () => {
  try {
    await apiAuth.patch('/backstages/messagesDelete/' + formDelete._id, formDelete)
    Swal.fire({
      icon: 'success',
      title: '成功',
      text: '刪除消息成功'
    })
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '失敗',
      text: '刪除消息失敗'
    })
  }
  formDelete.dialog = false
}

(async () => {
  try {
    const { data } = await apiAuth.get('/backstages/messages')
    rows.push(...data.result)
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '失敗',
      text: '讀取消息失敗'
    })
  }
})()
</script>

<style>
.q-textarea .q-field__native {
  resize: none;
}
</style>
