import { Schema, model, Error, ObjectId } from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'

const replySchema = new Schema({
  u_id: {
    type: ObjectId,
    ref: 'appointments',
    required: [true, '缺少預約']
  },
  reply: {
    type: String,
    required: [true, '缺少留言']
  }
})

const schema = new Schema({
  account: {
    type: String,
    required: [true, '缺少帳號'],
    minlength: [4, '帳號過短'],
    maxlength: [16, '帳號過長'],
    unique: true,
    match: [/^[A-Za-z0-9]+$/, '帳號格式錯誤']
  },
  password: {
    type: String,
    required: [true, '缺少密碼']
  },
  email: {
    type: String,
    required: [true, '缺少信箱'],
    unique: true,
    validtor: {
      validator (email) {
        return validator.isEmail(email)
      },
      message: '信箱格式錯誤'
    }
  },
  name: {
    type: String,
    required: [true, '缺少名字']
  },
  phone: {
    type: Number,
    required: [true, '缺少電話'],
    minlength: [10, '電話過短'],
    maxlength: [10, '電話過長']
  },
  birth: {
    type: String,
    default: 0
  },
  tokens: {
    type: [String],
    default: []
  },
  role: {
    type: Number,
    default: 0
  },
  pic: {
    type: String,
    default: 'https://cdn0.popo.tw/uc/108/696172/O.jpg'
  },
  available: {
    type: Number,
    default: 1
  },
  partner: {
    type: Number,
    default: 0
  },
  hobby: {
    type: String,
    default: '嘗試新事物'
  },
  category: {
    type: [String],
    enum: {
      values: ['運動', '遊戲', '逛街', '吃飯', '電影'],
      message: '分類錯誤'
    }
  },
  word: {
    type: String,
    default: ''
  },
  reply: {
    type: [replySchema],
    default: []
  }
}, { versionKey: false })

schema.pre('save', function (next) {
  const user = this
  if (user.isModified('password')) {
    if (user.password.length >= 4 && user.password.length <= 16) {
      user.password = bcrypt.hashSync(user.password, 10)
    } else {
      const error = new Error.ValidationError(null)
      error.addError('password', new Error.ValidatorError({ message: '密碼長度必須大於4小於16' }))
      next(error)
      return
    }
  }
  next()
})

schema.pre('findOneAndUpdate', function (next) {
  const user = this._update
  if (user.password) {
    if (user.password.length >= 4 && user.password.length <= 20) {
      user.password = bcrypt.hashSync(user.password, 10)
    } else {
      const error = new Error.ValidationError(null)
      error.addError('password', new Error.ValidatorError({ message: '密碼長度錯誤' }))
      next(error)
      return
    }
  }
  next()
})

export default model('users', schema)
