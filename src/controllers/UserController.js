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
    res.cookie('jwt', token, { httpOnly: true, maxAge: 86400000 })
    res.status(200).json({
      message: 'Você está autenticado!',
      token
    })
  }

  static async logout(req, res) {
    res.cookie('jwt', '', { maxAge: 1 })
    res.status(200).json({
      message: 'Você foi deslogado!'
    })
  }

  static async getUserById(req, res) {
    const id = req.user.id

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
    //Pega o ID do usuário vindo da autenticação
    const id = req.user.id

    const { name, email, phone, password, confirmpassword } = req.body
    

    const user = await User.findById(id).select('-password')

    //Validações
    //Checa se o usuário existe
    if (!user) {
      return res.status(422).json({
        status: 422,
        message: 'Usuário não encontrado'
      })
    }

    let image = ''

    if (req.file) {
      user.image = req.file.filename
    }

    if (!name || !email || !phone) {
      res.status(422).json({
        status: 422,
        message: 'Todos os campos devem ser preenchidos!'
      })

      return
    }

    user.name = name
    user.phone = phone

    //Checa se o e-mail informado é diferente do atual e se existe algum outro usuário utilizando o email informado

    //Verifica se existe um usuário com o usuário informado
    const userExists = await User.findOne({ email })

    //Se o e-mail informado por diferente do cadastrado mas já existir um usuário utilizando o email
    if (user.email !== email && userExists) {
      res.status(422).json({
        status: 422,
        message: 'E-mail em uso!'
      })

      return
    }

    //Se passar nas validações de email
    user.email = email

    //Senha
    if(password && confirmpassword) {
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
      } else if (password === confirmpassword && password != null) {
        //Gera nova senha criptografada
        const salt = await bcrypt.genSalt(12)
        const hashedPassword = await bcrypt.hash(password, salt)
  
        user.password = hashedPassword
      }
    }

    

    try {
      //Retorna o usuário atualizado
      const updatedUser = await User.findByIdAndUpdate(
        { _id: user._id },
        { $set: user },
        { new: true }
      ).select('-password')

      res.status(200).json({
        status: 200,
        message: 'Usuário atualizado com sucesso!',
        updatedUser
      })
    } catch (error) {
      return res.status(500).json({ status: 500, message: error })
    }
  }
}
