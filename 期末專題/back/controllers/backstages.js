import users from '../models/users.js'

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
      account: req.body.account,
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
