import express from 'express'
import { PetController } from '../controllers/PetController.js'

const router = express.Router()

//Middlewares
import ensureAuthenticated from '../middlewares/ensureAuthenticated.js'
import { imageUpload } from '../services/imageUpload.js'

router.post('/create', ensureAuthenticated, imageUpload.array('images'), PetController.create)
router.get('/', PetController.getAll)

export default router
