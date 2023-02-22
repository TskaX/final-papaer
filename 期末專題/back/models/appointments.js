import { Schema, model, ObjectId } from 'mongoose'

const appointmentSchema = new Schema({
  account: {
    type: String,
    required: [true, '缺少帳號']
  },
  name: {
    type: String,
    required: [true, '缺少姓名']
  },
  phone: {
    type: String,
    required: [true, '缺少電話']
  },
  email: {
    type: String,
    required: [true, '缺少信箱']
  },
  date: {
    type: String,
    required: [true, '缺少日期']
  },
  time: {
    type: String,
    required: [true, '缺少時間']
  },
  p_name: {
    type: String,
    required: [true, '缺少夥伴姓名']
  },
  p_pic: {
    type: String,
    default: 'https://cdn0.popo.tw/uc/108/696172/O.jpg'
  },
  u_pic: {
    type: String,
    default: 'https://cdn0.popo.tw/uc/108/696172/O.jpg'
  },
  place: {
    type: String,
    required: [true, '缺少地點']
  },
  a_date: {
    type: Date,
    default: () => Date.now() + 8 * 60 * 60 * 1000
  },
  u_reply: {
    type: String,
    default: ''
  },
  u_replyStatus: {
    type: Number,
    default: 0
  },
  p_replyStatus: {
    type: Number,
    default: 0
  },
  p_reply: {
    type: String,
    default: ''
  },
  done: {
    type: Number,
    default: 0
  },
  u_id: {
    type: ObjectId,
    ref: 'users',
    required: [true, '缺少使用者']
  },
  p_id: {
    type: ObjectId,
    ref: 'users',
    required: [true, '缺少工作人員']
  },
  thumb: {
    type: Boolean,
    default: true
  },
  love: {
    type: Boolean,
    default: true
  }
}, { versionKey: false })

export default model('appointments', appointmentSchema)
