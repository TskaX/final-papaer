<template>
  <div id="question">
    <div class="q-pa-md">
      <q-btn label="新增問題" @click="openDialog" class="add"></q-btn>
      <q-table
      title="個人發問"
      :rows="rows"
      :columns="columns"
      v-model:pagination="pagination"
      hide-pagination
      :filter="filter"
      row-key="_id"
      >
      <template v-slot:header="props">
          <q-tr :props="props">
            <q-th auto-width class="text-left">回覆情況</q-th>
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
            >
              {{ col.label }}
            </q-th>
            <q-th auto-width class="text-left">查看回覆</q-th>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td>
              {{ props.row.reply }}
            </q-td>
            <q-td
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
            >
              {{ col.value }}
            </q-td>
            <q-td auto-width>
              <q-btn size="sm" color="accent" round dense @click="props.expand = !props.expand" :icon="props.expand ? 'remove' : 'add'" v-if=showMessage(props.row.reply) />
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
        v-model="pagination.page"
        color="grey-8"
        :max="pagesNumber"
        size="sm"
      />
    </div>
    <q-dialog v-model="form.dialog" class="question-dialog">
      <q-card>
        <q-form @submit="submit" @reset="reset">
          <q-card-section class="row question-title">
            <div>問題發問</div>
          </q-card-section>
          <q-card-section class="question-main">
            <div class="row">
              <div class="col-5">主旨
                <q-input outlined v-model="form.title" :rules="[rules.required]"></q-input>
              </div>
              <div class="col-2"></div>
              <div class="col-5">方便聯絡時間
                <q-input outlined v-model="form.time" :rules="[rules.required]"></q-input>
              </div>
              <div class="col-12">描述問題
                <q-input outlined type="textarea" v-model="form.content" :rules="[rules.required]"></q-input>
              </div>
            </div>
          </q-card-section>
          <q-card-section class="question-btn">
            <q-btn label="發送" type="submit"></q-btn>
            <q-btn v-close-popup label="取消"/>
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

const form = reactive({
  title: '',
  time: '',
  content: '',
  dialog: false
})

const openDialog = () => {
  form.title = ''
  form.time = ''
  form.content = ''
  form.dialog = true
}

const submit = async () => {
  try {
    await apiAuth.post('/questions', form)
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

const filter = ref('')
const rows = reactive([])
const showMessage = (reply) => {
  if (reply === '已回覆') {
    return true
  } else {
    return false
  }
}
const test = () => {
  for (let i = 0; i <= rows.length - 1; i++) {
    if (rows[i].reply === 0) {
      rows[i].reply = '尚未回覆'
    } else {
      rows[i].reply = '已回覆'
    }
  }
}

const columns = reactive([
  {
    name: 'title',
    label: '主旨',
    align: 'left',
    field: row => row.title
  },
  {
    name: 'time',
    label: '聯絡時間',
    align: 'left',
    field: row => row.time
  },
  {
    name: 'content',
    label: '內容',
    align: 'left',
    field: row => row.content
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
    const { data } = await apiAuth.get('/questions/all')
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
