import mongoose from 'mongoose'
import 'dotenv/config'



async function connect() {
  try {
    await mongoose.connect(process.env.DB_URI)
    console.log('Banco conectado!')
  } catch (error) {
    console.log(`Houve um erro ao conectar ao banco: ${error}`)
  }
}

connect()

export default mongoose
