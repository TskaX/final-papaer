import { Router } from 'express'
import content from '../middleware/content.js'
import admin from '../middleware/admin.js'
import { jwt } from '../middleware/auth.js'
import { getAllUser, editUser, editAvailable, getAllpartner, addMessage, getMessage, editMessage, deleteMessage, getAllAppointment, getTodayAppointment, editAppointment, deleteAppointment, editReply, getNews } from '../controllers/backstages.js'
import upload from '../middleware/upload.js'

const router = Router()

router.get('/', jwt, admin, getAllUser)
router.patch('/:id', content('multipart/form-data'), jwt, upload, editUser)
router.patch('/available/:id', content('application/json'), jwt, editAvailable)
router.get('/partner', jwt, admin, getAllpartner)
router.post('/messages', jwt, admin, addMessage)
router.get('/messages', jwt, admin, getMessage)
router.patch('/messages/:id', jwt, admin, editMessage)
router.patch('/messagesDelete/:id', jwt, admin, deleteMessage)
router.get('/appointment', jwt, admin, getAllAppointment)
router.get('/TodayAppointment', jwt, admin, getTodayAppointment)
router.patch('/appointment/:id', jwt, admin, editAppointment)
router.patch('/appointmentDelete/:id', jwt, admin, deleteAppointment)
router.patch('/editReply/:id', jwt, admin, editReply)
router.get('/news', getNews)

export default router
