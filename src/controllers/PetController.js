import Pet from '../models/petModel.js'
import User from '../models/userModel.js'

export class PetController {
  static async create(req, res) {
    const { name, age, size, color } = req.body

    const available = true

    //Upload de imagem
    const images = req.files

    //Validações
    if (!name) {
      return res
        .status(422)
        .json({ status: 422, message: 'O nome é obrigatório' })
    }

    if (!age) {
      return res
        .status(422)
        .json({ status: 422, message: 'A idade é obrigatório' })
    }

    if (!size) {
      return res
        .status(422)
        .json({ status: 422, message: 'O peso é obrigatório' })
    }

    if (!color) {
      return res
        .status(422)
        .json({ status: 422, message: 'A cor é obrigatório' })
    }

    if (images.length === 0) {
      return res
        .status(422)
        .json({ status: 422, message: 'As fotos são obrigatórias' })
    }

    

    //Dono do pet
    const userId = req.user.id

    const user = await User.findById(userId)

    //Criar um Pet

    const pet = new Pet({
      name,
      age,
      size,
      color,
      available,
      image: [],
      user: {
        _id: user._id,
        name: user.name,
        image: user.image,
        phone: user.phone
      }
    })

    //Envia somente o nome das imagens para o array sem os outros dados juntos
    images.map((image) => {
      pet.image.push(image.filename)
    })

    try {
      const newPet = await pet.save()

      res
        .status(201)
        .json({ status: 201, message: 'Pet cadastrado com sucesso!,', newPet })
    } catch (error) {
      res.status(500).json({ status: 500, message: `${error}` })
    }
  }
}
