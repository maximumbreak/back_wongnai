import connectDB from './databases/mongodb'
import ReviewModel from './schema/reviews'

const fs = require('fs')
const csv = require('csv-parser')

let i = 0
export default async () => {
  const result = await ReviewModel.findOne({ id: 1 })
  return new Promise((res, rej) => {
    if (!result) {
      fs.createReadStream('./src/import/test_file.csv')
        .pipe(
          csv({
            headers: false,
          })
        )
        .on('data', async (data) => {
          if (i > 0) {
            const [id, reviews] = data[0].split(';')
            // console.log(id)
            await ReviewModel.create({ id, reviews })
          }
          i++
        })
        .on('end', () => {
          console.log('Success')
          res('Success')
        })
    } else {
      console.log('Has Data!!')
      res('Has Data!!')
    }
  })
}
//connectDB.then(async () => {})
