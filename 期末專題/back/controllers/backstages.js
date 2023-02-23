import users from '../models/users.js'
import messages from '../models/messages.js'
import appointments from '../models/appointments.js'

export const getAllUser = async (req, res) => {
  try {
    const result = await users.find({ partner: 0 })
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const editUser = async (req, res) => {
  try {
    const result = await users.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      email: req.body.email,
      pic: req.file?.path,
      phone: req.body.phone,
      birth: req.body.birth
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

export const editAvailable = async (req, res) => {
  try {
    const result = await users.findByIdAndUpdate(req.params.id, {
      available: req.body.available
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
      res.status(404).json({ success: false, message: '找不到789' })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

export const getAllpartner = async (req, res) => {
  try {
    const result = await users.find({ partner: 1 })
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const addMessage = async (req, res) => {
  try {
    const result = await messages.create({
      date: req.body.date,
      title: req.body.title,
      content: req.body.content
    })
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

export const getMessage = async (req, res) => {
  try {
    const message = await messages.find()
    const result = message.filter(el => el.title.length > 0)
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const editMessage = async (req, res) => {
  try {
    const result = await messages.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      content: req.body.content
    }, { new: true })
    if (!result) {
      res.status(404).json({ success: false, message: '找不到該消息' })
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

export const deleteMessage = async (req, res) => {
  try {
    const result = await messages.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      content: req.body.content
    }, { new: true })
    if (!result) {
      res.status(404).json({ success: false, message: '找不到該消息' })
    } else {
      res.status(200).json({ success: true, message: '', result })
    }
  } catch (error) {
    res.status(500).json({ success: false, message: '刪訊息未知錯誤' })
  }
}

export const getTodayAppointment = async (req, res) => {
  try {
    const resultToday = await appointments.find()
    const date = new Date().toString().substring(8, 10)
    const result = resultToday.filter(el => el.date.substring(8, 10) === date).filter(el => el.time.length > 0 && el.date.length > 0 && el.done !== 0)
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const getAllAppointment = async (req, res) => {
  try {
    const appointment = await appointments.find()
    const result = appointment.filter(el => el.time.length > 0 && el.date.length > 0 && el.done !== 0)
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const editAppointment = async (req, res) => {
  try {
    const result = await appointments.findByIdAndUpdate(req.params.id, {
      date: req.body.date,
      time: req.body.time,
      p_name: req.body.p_name,
      place: req.body.place
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

export const deleteAppointment = async (req, res) => {
  try {
    const result = await appointments.findByIdAndUpdate(req.params.id, {
      date: req.body.date,
      time: req.body.time,
      p_name: req.body.p_name,
      place: req.body.place
    }, { new: true })
    if (!result) {
      res.status(404).json({ success: false, message: '找不到該預約' })
    } else {
      res.status(200).json({ success: true, message: '', result })
    }
  } catch (error) {
    res.status(500).json({ success: false, message: '刪訊息未知錯誤' })
  }
}

export const editReply = async (req, res) => {
  try {
    const result = await appointments.findByIdAndUpdate(req.params.id, {
      u_reply: req.body.u_reply,
      p_reply: req.body.p_reply
    }, { new: true })
    if (!result) {
      res.status(404).json({ success: false, message: '找不到該留言' })
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

export const getNews = async (req, res) => {
  try {
    const message = await messages.find()
    const result = message.filter(el => el.title.length > 0)
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}
