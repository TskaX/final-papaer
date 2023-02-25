import questions from '../models/questions.js'

export const addQuestion = async (req, res) => {
  try {
    const result = await questions.create({
      title: req.body.title,
      time: req.body.time,
      content: req.body.content,
      u_id: req.user._id
    })
    await req.user.save()
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}
export const getQuestions = async (req, res) => {
  try {
    const result = await questions.find({ u_id: req.user._id }).populate('u_id', 'account')
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const getNoneQuestions = async (req, res) => {
  try {
    const result = await questions.find({ reply: 0 }).populate('u_id', 'account phone')
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const getDoneQuestions = async (req, res) => {
  try {
    const result = await questions.find({ reply: 1 }).populate('u_id', 'account phone')
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const replyContent = async (req, res) => {
  try {
    const result = await questions.findByIdAndUpdate(req.params.id, {
      replyContent: req.body.replyContent,
      reply: req.body.reply
    }, { new: true }).populate('u_id', 'account phone')
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
