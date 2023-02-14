import { Schema, model } from 'mongoose'

const messageSchema = new Schema({
  date: {
    type: String,
    required: [true, '缺少日期']
  },
  title: {
    type: String,
    required: [true, '缺少主旨']
  },
  content: {
    type: String,
    required: [true, '缺少訊息內容']
  }
}, { versionKey: false })

export default model('messages', messageSchema)
