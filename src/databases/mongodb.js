import mongoose from 'mongoose'
import env from 'dotenv'

const NODE_ENV = process.env.NODE_ENV
const DB_USER = process.env.DB_USER
const DB_PASS = process.env.DB_PASS

let connectDB =
  NODE_ENV !== 'PROD'
    ? mongoose.connect('mongodb://localhost/wongnai', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
    : mongoose.connect(`mongodb://mongo/wongnai`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })

export default connectDB
