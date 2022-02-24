import 'dotenv/config'
import jwt from 'jsonwebtoken'

const createUserToken = async user => {
  //Cria um JWT assinado
  const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
    expiresIn: '1d'
  })

  return token
}

export default createUserToken
