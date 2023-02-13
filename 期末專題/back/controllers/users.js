import users from '../models/users.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

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
        pic: req.user.pic
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤 | 抓資料' })
  }
}

export const editPicture = async (req, res) => {
  try {
    req.user.pic = req.file.path
    await req.user.save()
    res.status(200).json({ success: true, message: '' })
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
    await users.create({
      account: req.body.account,
      password: req.body.password,
      email: req.body.email,
      name: req.body.name,
      phone: req.body.phone,
      birth: req.body.birth,
      pic: req.file?.path,
      partner: req.body.partner
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

export const editPartner = async (req, res) => {
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
