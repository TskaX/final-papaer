import { Router } from 'express'
import content from '../middleware/content.js'
import * as auth from '../middleware/auth.js'
import upload from '../middleware/upload.js'
import { register, login, logout, getUser, editPicture, changePassword, addPartner, editPartner, getAllPartner, addAppointment, getAppointment, checkAppointment, replyAppointment, replyMember, getAppointmentReply, encourageAppointment, finishAppointment, getWorkAppointment, AppointmentReplyP } from '../controllers/users.js'

const router = Router()

router.post('/', content('application/json'), register)
router.post('/login', content('application/json'), auth.login, login)
router.delete('/logout', auth.jwt, logout)
router.get('/me', auth.jwt, getUser)
router.patch('/', content('multipart/form-data'), auth.jwt, upload, editPicture)
router.patch('/password', content('application/json'), auth.jwt, changePassword)
router.post('/partner', content('multipart/form-data'), auth.jwt, upload, addPartner)
router.patch('/partner/:id', content('multipart/form-data'), auth.jwt, upload, editPartner)
router.get('/partner', getAllPartner)
router.post('/appointment', content('application/json'), auth.jwt, addAppointment)
router.get('/appointment', auth.jwt, getAppointment)
router.get('/workAppointment', auth.jwt, getWorkAppointment)
router.patch('/appointment/:id', content('application/json'), auth.jwt, checkAppointment)
router.post('/replyAppointment/:id', auth.jwt, replyAppointment)
router.post('/replyMember/:id', auth.jwt, replyMember)
router.get('/appointmentReplyP', auth.jwt, AppointmentReplyP)
router.get('/appointmentReply', auth.jwt, getAppointmentReply)
router.patch('/encourageAppointment/:id', auth.jwt, encourageAppointment)
router.patch('/finishAppointment/:id', auth.jwt, finishAppointment)

export default router
