<template>
  <q-page class="flex flex-center" style="min-height:100%" id="front-main">
    <img src="https://i.imgur.com/51tzq2A.jpg">
    <div class="column" style="height: 80px ">
      <div class="col">
        <a href="#">TOP</a>
        <a href="#container-A">About Us</a>
        <a href="#container-B">Partner Intro</a>
        <a href="#">Contact Us</a>
        <a href="#">Advise Us</a>
      </div>
    </div>
    <div id="container-A">
      <h1>About Us</h1>
      <div class="column"></div>
    </div>
    <div id="container-B">
      <h1>Partner Intro</h1>
      <q-card v-for="row in rows" :key="row._id">
        <q-card-section>
          <q-img :src="row.pic"></q-img>
          <q-btn label="預約" @click="openDialog(row._id)"></q-btn>
        </q-card-section>
      </q-card>
      <q-dialog v-model="form.dialog">
        <q-card>
          <q-card-section>
            <div class="row justify-center">
              <div class="col-5">
                <span>帳號</span>
                <q-input outlined v-model="user.account"></q-input>
              </div>
              <div class="col-1"></div>
              <div class="col-5">
                <span>姓名</span>
                <q-input outlined v-model="user.name"></q-input>
              </div>
              <div class="col-5">
                <span>電話</span>
                <q-input outlined v-model="user.phone"></q-input>
              </div>
              <div class="col-1"></div>
              <div class="col-5">
                <span>信箱</span>
                <q-input outlined v-model="user.email"></q-input>
              </div>
            </div>
            <br/><hr>
          </q-card-section>
          <q-card-section>
            <div class="row justify-center">
              <div class="col-5">
                <span>日期</span>
                <q-input filled v-model="date" mask="date" :rules="['date']">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="date">
                          <div class="row items-center justify-end">
                            <q-btn label="確認" flat v-close-popup></q-btn>
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-1"></div>
              <div class="col-5">
                <span>時間</span>
                <q-select color="teal" filled v-model="time" :options="options" label="Time">
                  <template v-slot:prepend>
                    <q-icon name="event" />
                  </template>
                </q-select>
              </div>
              <div class="col-5">
                <span>夥伴名字</span>
                <q-input outlined v-model="form.p_name"></q-input>
              </div>
              <div class="col-1"></div>
              <div class="col-5">
                <span>地點</span>
                <q-input outlined v-model="form.place"></q-input>
              </div>
            </div>
          </q-card-section>
          <q-card-section style="text-align:center">
            <q-btn label="確認" @click="submit"></q-btn>
            <q-btn label="取消" v-close-popup></q-btn>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import { apiAuth } from 'src/boot/axios'
import Swal from 'sweetalert2'
import { reactive, ref } from 'vue'
import { useUserStore } from '../stores/store'

const user = useUserStore()
const getDate = new Date()
const year = getDate.getFullYear()
let month = (getDate.getMonth() + 1).toString()
let day = (getDate.getDate() + 1).toString()
const addZeroFunction = () => {
  if (month < 10) {
    month = month.padStart(2, '0')
  } else {
    return month
  }
  if (day < 10) {
    day = day.padStart(2, '0')
  } else {
    return day
  }
}
addZeroFunction()
const date = ref(year + '/' + month + '/' + day)

const time = ref(null)
const options = [
  '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
]

const form = reactive({
  dialog: false,
  time: '',
  date: '',
  account: '',
  name: '',
  phone: '',
  email: '',
  p_name: '',
  place: '',
  p_pic: '',
  p_id: ''
})

const openDialog = (id) => {
  const index = rows.findIndex(el => el._id === id)
  form.p_pic = rows[index].pic
  form.p_name = rows[index].name
  form.p_id = rows[index]._id
  form.dialog = true
  form.place = ''
}

const submit = async () => {
  form.time = time.value
  form.date = date.value
  form.account = user.account
  form.name = user.name
  form.phone = user.phone
  form.email = user.email
  form.dialog = false
  try {
    await apiAuth.post('/users/appointment', form)
    Swal.fire({
      icon: 'success',
      title: '預約成功',
      text: '請前往個人資料預約紀錄進行確認'
    })
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '預約失敗',
      text: '請聯絡客服，協助進行處理'
    })
  }
}

const rows = reactive([]);

(async () => {
  const { data } = await apiAuth.get('/users/partner')
  rows.push(...data.result)
  console.log(rows)
})()
</script>

<style>
@media (min-width: 600px) {
  .q-dialog__inner--minimized > div {
    max-width: none;
  }
}

</style>
