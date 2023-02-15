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
  place: {
    type: String,
    required: [true, '缺少地點']
  },
  u_reply: {
    type: String,
    default: ''
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
  }
}, { versionKey: false })

export default model('appointments', appointmentSchema)
