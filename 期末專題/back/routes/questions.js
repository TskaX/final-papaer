import { Router } from 'express'
import content from '../middleware/content.js'
import * as auth from '../middleware/auth.js'
import { addQuestion, getQuestions, getNoneQuestions, getDoneQuestions, replyContent } from '../controllers/questions.js'

const router = Router()

router.post('/', content('application/json'), auth.jwt, addQuestion)
router.get('/all', auth.jwt, getQuestions)
router.get('/none', auth.jwt, getNoneQuestions)
router.get('/done', auth.jwt, getDoneQuestions)
router.post('/replyContent/:id', content('application/json'), auth.jwt, replyContent)

export default router
