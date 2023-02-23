<template>
  <q-page class="flex flex-center" style="min-height:100%" id="front-main">
    <div class="video">
      <video autoplay muted loop id="myVideo">
        <source src="../assets/video2.mp4" type="video/mp4">
      </video>
      <div class="sloganA"></div>
      <div class="sloganB"></div>
    </div>
    <div id="about-us">
      <h1>關於我們</h1>
      <div class="row">
        <div class="left">
          <q-card>
            <q-card-section>
              開創想法
            </q-card-section>
            <q-card-section>
              <div class="content">
                在這科技越來越進步的年代，明明彼此間的距離因為科技拉近了，但卻也因此更冷漠。何時起，無時無刻我們總想著盯著手上那冰冷的螢幕，缺少了眼神間的交流。是不是偶爾想找個人出門吃飯逛街的時候，總是被推三阻四的，或是因為彼此的假期無法契合而作廢。是不是偶爾想找個人抒發情緒，暢談自己滿腹的牢騷，卻找不到朋友，也不想跟家人傾訴。
              </div>
              <br>
              <div class="content">
                「友伴」，就是在這樣的困擾中誕生了，前面所有的問題，都能靠它迎刃而解。好奇嗎？試試看就知道了！
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="right">
          <div class="q-pa-md">
            <q-table
              title="消息發送"
              :rows="rowsNews"
              :columns="columns"
              row-key="_id"
              hide-bottom
              :pagination="initialPagination"
            />
          </div>
        </div>
      </div>
    </div>
    <div id="partner-intro">
      <div class="container">
        <h1>夥伴介紹</h1>
        <swiper :slidesPerView="1" :spaceBetween="30" :loop="true" :navigation="true" :pagination="{
          clickable: true,
        }" :breakpoints="{
            '600': {
              slidesPerView: 1,
            },
            '1024': {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            '1440': {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          }" :modules="modules" class="mySwiper">
          <!-- :autoplay="{
            delay: 5000,
            disableOnInteraction: false,
          }" -->
          <swiper-slide v-for="row in rows" :key="row._id">
            <q-card>
              <q-img :src="row.pic" class="worker-pic"></q-img>
              <q-card-section>
                <div class="worker-name">{{ row.name }}</div>
                <div class="worker-personal">個性：{{ row.personal }}</div>
                <div class="worker-hobby">興趣：{{ row.hobby }}</div>
                <div class="worker-word">給大家的一句話：{{ row.word }}</div>
                <q-btn label="預約" @click="openDialog(row._id)" v-if="user.isLogin"></q-btn>
              </q-card-section>
              <marquee scrolldelay="80" scrollamount="3">
                <span v-for="message in row.reply" :key="message._id">{{
                  message.reply
                }}<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                </span>
              </marquee>
            </q-card>
          </swiper-slide>
        </swiper>
      </div>
      <q-dialog v-model="form.dialog">
        <q-card>
          <q-card-section>
            <div class="row justify-center">
              <div class="col-5">
                <span>帳號</span>
                <q-input outlined v-model="user.account" disable></q-input>
              </div>
              <div class="col-1"></div>
              <div class="col-5">
                <span>姓名</span>
                <q-input outlined v-model="user.name" disable></q-input>
              </div>
              <div class="col-5">
                <span>電話</span>
                <q-input outlined v-model="user.phone" disable></q-input>
              </div>
              <div class="col-1"></div>
              <div class="col-5">
                <span>信箱</span>
                <q-input outlined v-model="user.email" disable></q-input>
              </div>
            </div>
            <br />
            <hr>
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
                <q-select color="teal" filled v-model="time" :options="options" label="Time" :rules="[rules.required]">
                  <template v-slot:prepend>
                    <q-icon name="event" />
                  </template>
                </q-select>
              </div>
              <div class="col-5">
                <span>夥伴名字</span>
                <q-input outlined v-model="form.p_name" disable></q-input>
              </div>
              <div class="col-1"></div>
              <div class="col-5">
                <span>地點</span>
                <q-input outlined v-model="form.place" :rules="[rules.required]"></q-input>
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
import { apiAuth, api } from 'src/boot/axios'
import Swal from 'sweetalert2'
import { reactive, ref } from 'vue'
import { useUserStore } from '../stores/store'
import { useRouter } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { Pagination, Navigation } from 'swiper'

import { gsap } from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'
gsap.registerPlugin(TextPlugin)

const modules = [Pagination, Navigation]
const router = useRouter()
const user = useUserStore()
const getDate = new Date()
const year = getDate.getFullYear()
let month = (getDate.getMonth() + 1).toString()
let day = (getDate.getDate() + 1).toString()

const rules = {
  required (value) {
    return !!value || '欄位必填'
  }
}

const columns = reactive([
  {
    name: 'date',
    label: '發布日期',
    align: 'left',
    field: row => row.date
  },
  {
    name: 'title',
    label: '主旨',
    align: 'left',
    field: row => row.title
  },
  {
    name: 'content',
    label: '內容',
    align: 'left',
    field: row => row.content
  }
])

const initialPagination = {
  sortBy: 'desc',
  page: 1,
  rowsPerPage: 5
}

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
      text: '確認預約資料無誤後，麻煩送出預約'
    })
    router.push('/appointment')
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '預約失敗',
      text: '請聯絡客服，協助進行處理'
    })
  }
}

const rows = reactive([])
const rowsNews = reactive([]);

(async () => {
  const { data } = await apiAuth.get('/users/partner')
  const { data: news } = await api.get('/backstages/news')
  rows.push(...data.result)
  news.result.reverse()
  rowsNews.push(...news.result)

  const sloganA = document.querySelector('.sloganA')
  const sloganB = document.querySelector('.sloganB')
  const tl = gsap.timeline({ delay: 1.5 })
  tl.to(sloganA, {
    duration: 1.5,
    text: '寂寞不簡單',
    ease: 'linear',
    opacity: 1
  })
    .to(sloganB, {
      duration: 1.5,
      text: '簡單不寂寞',
      ease: 'linear',
      opacity: 1
    })
})()
</script>

<style>
@media (min-width: 600px) {
  .q-dialog__inner--minimized>div {
    max-width: none;
  }
}
</style>

<!-- <q-card v-for="row in rows" :key="row._id">
  <q-card-section>
    <q-img :src="row.pic"></q-img>
    <q-btn label="預約" @click="openDialog(row._id)"></q-btn>
  </q-card-section>
</q-card> -->
