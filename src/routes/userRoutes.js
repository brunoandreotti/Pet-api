import express from 'express'
import UserController from '../controllers/UserController.js'
//Middlewares
import ensureAuthenticated from '../middlewares/ensureAuthenticated.js'
import { imageUpload } from '../services/imageUpload.js'

const router = express.Router()

//Rota deve salvar novo um usuário no banco de dados
router.post('/register', UserController.register)

//Rota deve logar um usuário existente no banco de dados
router.post('/login', UserController.login)

//Rota deve deslogar um usuário existente no banco de dados
router.get('/logout', UserController.logout)

//Rota deve retornar os dados de um usuário baseado no ID
router.get('/info', ensureAuthenticated, UserController.getUserById)

router.patch(
  '/edit',
  ensureAuthenticated,
  imageUpload.single('image'),
  UserController.editUser
)

export default router
