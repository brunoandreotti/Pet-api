import bcrypt from 'bcrypt'
import User from '../models/userModel.js'
import createUserToken from '../services/createUserToken.js'

export default class UserController {
  static async register(req, res) {
    const { name, email, password, phone, confirmpassword } = req.body

    //Validações
    if (!name || !email || !password || !phone || !confirmpassword) {
      res.status(422).json({
        status: 422,
        message: 'Todos os campos devem ser preenchidos!'
      })

      return
    }

    if (password.length < 8) {
      res.status(422).json({
        status: 422,
        message: 'A senha deve conter pelo menos 8 caracteres!'
      })

      return
    }

    if (password !== confirmpassword) {
      res.status(422).json({
        status: 422,
        message: 'A confirmação de senha deve ser igual à senha!'
      })

      return
    }

    //Checa se o usuário já existe
    const userExists = await User.findOne({ email })

    if (userExists) {
      res.status(422).json({
        status: 422,
        message: 'E-mail já cadastrado!'
      })

      return
    }

    //Gera senha criptografada
    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(password, salt)

    //Cria um novo usuário
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone
    })

    try {
      //Salva o novo usuário no banco
      await newUser.save()
      res.status(201).json({
        status: 201,
        message: `Usuário com o e-mail '${newUser.email}' criado com sucesso!`
      })
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message })
    }
  }

  static async login(req, res) {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(422).json({
        status: 422,
        message: 'Todos os campos devem ser preenchidos!'
      })

      return
    }

    const user = await User.findOne({ email })

    if (!user) {
      res.status(422).json({
        status: 422,
        message: 'E-mail ou senha incorreto!'
      })

      return
    }

    //Verifica se a senha passada pelo usuário é a mesma existente no banco
    //Se as senhas foram iguais retorna 'true' se não retorna 'false'
    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      res.status(422).json({
        status: 422,
        message: 'E-mail ou senha incorreto!'
      })

      return
    }

    //Gera o token de autenticação
    const token = await createUserToken(user)

    //Retorna o token

    res.status(200).json({
      message: 'Você está autenticado!',
      token
    })
  }

  static async getUserById(req, res) {
    const id = req.params.id

    //Retorna os dados do usuário baseado no id menos o password
    const user = await User.findById(id).select('-password')

    if (!user) {
      return res.status(422).json({
        status: 422,
        message: 'Usuário não encontrado!'
      })
    }

    res.status(200).json({ user })
  }

  static async editUser(req, res) {
    const id = req.user.id

    const user = await User.findById(id).select('-password')

    return res.status(200).json({
      status: 200,
      message: 'Deu certo o update!',
      user
    })
  }
}
