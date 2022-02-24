import express from 'express'
import UserController from '../controllers/UserController.js'

const router = express.Router()

//Middlewares
import ensureAuthenticated from '../middlewares/ensureAuthenticated.js'

//Rota deve salvar novo um usuário no banco de dados
router.post('/register', UserController.register)

//Rota deve logar um usuário existente no banco de dados
router.post('/login', UserController.login)

//Rota deve retornar os dados de um usuário baseado no ID
router.get('/info', ensureAuthenticated, UserController.getUserById)

router.patch('/edit', ensureAuthenticated, UserController.editUser)

export default router
