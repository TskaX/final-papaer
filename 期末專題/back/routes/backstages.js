import { Router } from 'express'
import content from '../middleware/content.js'
import admin from '../middleware/admin.js'
import { jwt } from '../middleware/auth.js'
import { getAllUser, editUser, editAvailable, getAllpartner, addMessage, getMessage, editMessage, deleteMessage } from '../controllers/backstages.js'
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

export default router
