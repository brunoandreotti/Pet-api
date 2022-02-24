export const getToken = (req) => {
  //Pega o token vindo no header
  const authHeaders = req.headers.authorization

  //Por padrão o token é enviado como 'Bearer token', com isso é necessário fazer um split para resgatar somente o token
  const [, token] = authHeaders.split(' ')

  return token
}
