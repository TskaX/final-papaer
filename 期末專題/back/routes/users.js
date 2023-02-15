import { Router } from 'express'
import content from '../middleware/content.js'
import * as auth from '../middleware/auth.js'
import upload from '../middleware/upload.js'
import { register, login, logout, getUser, editPicture, changePassword, addPartner, editPartner, getAllPartner, addAppointment } from '../controllers/users.js'

const router = Router()

router.post('/', content('application/json'), register)
router.post('/login', content('application/json'), auth.login, login)
router.delete('/logout', auth.jwt, logout)
router.get('/me', auth.jwt, getUser)
router.patch('/', content('multipart/form-data'), auth.jwt, upload, editPicture)
router.patch('/password', content('application/json'), auth.jwt, changePassword)
router.post('/partner', content('multipart/form-data'), auth.jwt, upload, addPartner)
router.patch('/partner/:id', content('multipart/form-data'), auth.jwt, upload, editPartner)
router.get('/partner', auth.jwt, getAllPartner)
router.post('/appointment', content('application/json'), auth.jwt, addAppointment)

export default router
