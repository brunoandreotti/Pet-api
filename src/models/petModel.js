import mongoose from '../db/connection.js'
const { Schema } = mongoose

const Pet = mongoose.model(
  'Pet',
  new Schema(
    {
      name: {
        type: String,
        required: true
      },
      age: {
        type: Number,
        required: true
      },
      size: {
        type: String,
        required: true
      },
      color: {
        type: String,
        required: true
      },
      image: {
        type: Array,
        required: true
      },
      available: {
        type: Boolean,
        
      },
      user: Object,
      adopter: Object
    },
    { timestamps: true }
  )
)

export default Pet
