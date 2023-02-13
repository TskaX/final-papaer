import { Router } from 'express'
import content from '../middleware/content.js'
import * as auth from '../middleware/auth.js'
import upload from '../middleware/upload.js'
import { register, login, logout, getUser, editPicture, changePassword, addPartner, editPartner } from '../controllers/users.js'

const router = Router()

router.post('/', content('application/json'), register)
router.post('/login', content('application/json'), auth.login, login)
router.delete('/logout', auth.jwt, logout)
router.get('/me', auth.jwt, getUser)
router.patch('/', content('multipart/form-data'), auth.jwt, upload, editPicture)
router.patch('/password', content('application/json'), auth.jwt, changePassword)
router.post('/partner', content('multipart/form-data'), auth.jwt, upload, addPartner)
router.patch('/partner/:id', content('multipart/form-data'), auth.jwt, upload, editPartner)

export default router
