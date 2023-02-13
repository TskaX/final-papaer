import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import userRoute from './routes/users.js'
import questionRoute from './routes/questions.js'
import backstageRoute from './routes/backstages.js'
import './passport/passport.js'

mongoose.connect(process.env.DB_URL)
mongoose.set('sanitizeFilter', true)

const app = express()

app.use(cors({
  origin (origin, callback) {
    if (origin.includes('github') || origin.includes('localhost')) {
      callback(null, true)
    } else {
      callback(new Error(), false)
    }
  }
}))
app.use((_, req, res, next) => {
  res.status(403).json({ success: false, message: '請求被拒1' })
})

app.use(express.json())
app.use((_, req, res, next) => {
  res.status(400).json({ success: false, message: '格次錯誤' })
})

app.use('/users', userRoute)
app.use('/questions', questionRoute)
app.use('/backstages', backstageRoute)

app.all('*', (req, res) => {
  res.status(404).json({ success: false, message: '找不到' })
})

app.listen(process.env.PORT || 4000, () => {
  console.log('啟動')
})
