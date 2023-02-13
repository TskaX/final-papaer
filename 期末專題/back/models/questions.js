import { Schema, model, ObjectId } from 'mongoose'

const questionSchema = new Schema({
  title: {
    type: String,
    required: [true, '缺少主旨']
  },
  time: {
    type: String,
    required: [true, '缺少聯絡時間']
  },
  content: {
    type: String,
    required: [true, '缺少問題內容']
  },
  reply: {
    type: Number,
    default: 0
  },
  replyContent: {
    type: String,
    default: ''
  },
  u_id: {
    type: ObjectId,
    ref: 'users',
    required: [true, '缺少使用者']
  }
}, { versionKey: false })

export default model('questions', questionSchema)
