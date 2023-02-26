import users from '../models/users.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import appointments from '../models/appointments.js'

export const register = async (req, res) => {
  try {
    await users.create({
      account: req.body.account,
      password: req.body.password,
      email: req.body.email,
      name: req.body.name,
      phone: req.body.phone,
      birth: req.body.birth
    })
    res.status(200).json({ success: true, message: '' })
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(400).json({ success: false, message: '帳號重複' })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

export const login = async (req, res) => {
  try {
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '30 days' })
    req.user.tokens.push(token)
    await req.user.save()
    res.status(200).json({
      success: true,
      message: '',
      result:
      {
        account: req.user.account,
        email: req.user.email,
        role: req.user.role,
        name: req.user.name,
        phone: req.user.phone,
        birth: req.user.birth,
        pic: req.user.pic,
        available: req.user.available,
        partner: req.user.partner,
        token
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤 | 登入' })
  }
}

export const logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token !== req.token)
    await req.user.save()
    res.status(200).json({ success: true, message: '' })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤 | 登出' })
  }
}

export const getUser = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: '',
      result: {
        account: req.user.account,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        birth: req.user.birth,
        role: req.user.role,
        pic: req.user.pic,
        partner: req.user.partner
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤 | 抓資料' })
  }
}

export const editPicture = async (req, res) => {
  try {
    req.user.pic = req.file.path
    const result = req.user.pic
    await req.user.save()
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else if (error.name === 'CastError') {
      res.status(404).json({ success: false, message: '找不到123' })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

export const changePassword = async (req, res) => {
  try {
    if (bcrypt.compareSync(req.body.password, req.user.password)) {
      req.user.password = req.body.NewPassword
      await req.user.save()
      res.status(200).json({ success: true, message: '' })
    } else {
      res.stauts(200).json({ success: false, message: '密碼錯誤' })
    }
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const addPartner = async (req, res) => {
  try {
    const result = await users.create({
      account: req.body.account,
      password: req.body.password,
      email: req.body.email,
      name: req.body.name,
      phone: req.body.phone,
      birth: req.body.birth,
      pic: req.file?.path,
      partner: req.body.partner,
      word: req.body.word,
      hobby: req.body.hobby,
      category: req.body.category
    })
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(400).json({ success: false, message: '帳號重複' })
      console.log(error)
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

export const editPartner = async (req, res) => {
  try {
    const result = await users.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      email: req.body.email,
      pic: req.file?.path,
      phone: req.body.phone,
      birth: req.body.birth,
      word: req.body.word,
      hobby: req.body.hobby,
      category: req.body.category
    }, { new: true })
    await req.user.save()
    if (!result) {
      res.status(404).json({ success: false, message: '找不到使用者' })
    } else {
      res.status(200).json({ success: true, message: '', result })
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else if (error.name === 'CastError') {
      res.status(404).json({ success: false, message: '找不到456' })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

export const getAllPartner = async (req, res) => {
  try {
    const result = await users.find({ partner: 1, available: 1 })
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const addAppointment = async (req, res) => {
  try {
    const data = await appointments.find()
    const data2 = data.filter(el => el.date === req.body.date && el.time === req.body.time && el.p_id.toString() === req.body.p_id.toString())
    if(data2.length > 0) {
      const result = '預約時間重複'
      res.status(200).json({success: true, message: '預約時間重複', result})
    } else {
      await appointments.create({
        account: req.body.account,
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        date: req.body.date,
        time: req.body.time,
        p_name: req.body.p_name,
        place: req.body.place,
        u_id: req.user._id,
        p_pic: req.body.p_pic,
        p_id: req.body.p_id,
        u_pic: req.user.pic
      })
      res.status(200).json({ success: true, message: '' })
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(400).json({ success: false, message: '帳號重複' })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

export const getAppointment = async (req, res) => {
  try {
    const appointment = await appointments.find({ u_id: req.user._id })
    const result = appointment.filter(el => el.time.length > 0 && el.date.length > 0)
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const getWorkAppointment = async (req, res) => {
  try {
    const appointment = await appointments.find({ p_id: req.user._id })
    const result = appointment.filter(el => el.time.length > 0 && el.date.length > 0 && el.done !== 0)
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const checkAppointment = async (req, res) => {
  try {
    const result = await appointments.findByIdAndUpdate(req.params.id, {
      date: req.body.date,
      time: req.body.time,
      p_name: req.body.p_name,
      place: req.body.place,
      done: req.body.done
    }, { new: true })
    if (!result) {
      res.status(404).json({ success: false, message: '找不到該預約' })
    } else {
      res.status(200).json({ success: true, message: '', result })
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else if (error.name === 'CastError') {
      res.status(404).json({ success: false, message: '找不到789' })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

export const AppointmentReplyP = async (req, res) => {
  try {
    const appointment = await appointments.find({ u_id: req.user._id })
    const result = appointment.filter(el => el.time.length > 0 && el.date.length > 0 && el.p_reply.length > 0)
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const replyAppointment = async (req, res) => {
  try {
    const result = await appointments.findByIdAndUpdate(req.params.id, {
      u_reply: req.body.u_reply,
      u_replyStatus: req.body.u_replyStatus
    }, { new: true })
    req.user.reply.push({
      u_id: req.user._id,
      reply: req.body.u_reply
    })
    await req.user.save()
    if (!result) {
      res.status(404).json({ success: false, message: '找不到預約' })
    } else {
      res.status(200).json({ success: true, message: '', result })
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else if (error.name === 'CastError') {
      res.status(404).json({ success: false, message: '找不到預約' })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

export const replyMember = async (req, res) => {
  try {
    const result = await appointments.findByIdAndUpdate(req.params.id, {
      p_reply: req.body.p_reply,
      p_replyStatus: req.body.p_replyStatus
    }, { new: true })
    await req.user.save()
    if (!result) {
      res.status(404).json({ success: false, message: '找不到預約' })
    } else {
      res.status(200).json({ success: true, message: '', result })
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else if (error.name === 'CastError') {
      res.status(404).json({ success: false, message: '找不到預約' })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

export const getAppointmentReply = async (req, res) => {
  try {
    const appointment = await appointments.find({ p_id: req.user._id })
    const result = appointment.filter(el => el.time.length > 0 && el.date.length > 0 && el.u_reply.length > 0)
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const encourageAppointment = async (req, res) => {
  try {
    const result = await appointments.findByIdAndUpdate(req.params.id, {
      thumb: req.body.thumb,
      love: req.body.love
    }, { new: true })
    await req.user.save()
    if (!result) {
      res.status(404).json({ success: false, message: '找不到預約' })
    } else {
      res.status(200).json({ success: true, message: '', result })
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else if (error.name === 'CastError') {
      res.status(404).json({ success: false, message: '找不到預約' })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

export const finishAppointment = async (req, res) => {
  try {
    const result = await appointments.findByIdAndUpdate(req.params.id, {
      done: req.body.done
    }, { new: true })
    await req.user.save()
    if (!result) {
      res.status(404).json({ success: false, message: '找不到預約' })
    } else {
      res.status(200).json({ success: true, message: '', result })
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else if (error.name === 'CastError') {
      res.status(404).json({ success: false, message: '找不到預約' })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}
