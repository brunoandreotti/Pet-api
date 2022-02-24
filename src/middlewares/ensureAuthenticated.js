import jwt from 'jsonwebtoken'
import { getToken } from '../services/getToken.js'

const ensureAuthenticated = (req, res, next) => {
  const authHeaders = req.headers.authorization

  //Verificado se há um header de autenticação
  if (!authHeaders) {
    return res.status(401).json({ status: 401, message: 'Acesso Negado!' })
  }

  //Pega o token vindo do header da requisição
  const token = getToken(req)

  try {
    //Decodifica o token, se for valido, envia as informações do user na requisição
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = {
      id: decoded.id
    }
    next()
  } catch (error) {
    return res.status(400).json({ status: 400, message: 'Token inválido!' })
  }
}

export default ensureAuthenticated
