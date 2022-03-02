import cors from 'cors'
import express from 'express'

//Routers
import userRoutes from './routes/userRoutes.js'
import petRoutes from './routes/petRoutes.js'

const app = express()

//CORS config
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))

//Leitura do corpo da rep
app.use(express.json())

//Configura diretório de arquivos estáticos
app.use(express.static('public'))

//Rotas
app.use('/users', userRoutes)
app.use('/pets', petRoutes)



app.listen(3000, () => console.log('Servidor rodando!'))
