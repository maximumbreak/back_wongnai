import connectDB from './databases/mongodb'
import ReviewModel from './schema/reviews'
import { client, indexExists, deleteIndex, initIndex } from './utils/els'

const fs = require('fs')
const csv = require('csv-parser')

let i = 0
export default async () => {
  const result = await ReviewModel.findOne({ id: 1 })
  const resultIndex = await indexExists('reviews')
  return new Promise(async (res, rej) => {
    if (!result) {
      if (resultIndex) {
        await deleteIndex('reviews')
      }
      await initIndex('reviews')
      await client.cluster.putSettings({
        body: {
          transient: {
            'cluster.routing.allocation.disk.watermark.low': '20gb',
            'cluster.routing.allocation.disk.watermark.high': '15gb',
            'cluster.routing.allocation.disk.watermark.flood_stage': '10gb',
          },
        },
      })
      // index: 'reviews',
      // type: 'reviews',
      // body: {
      //   properties: {
      //     id: { type: 'integer' },
      //     reviews: { type: 'text' },
      //   },
      // },
      // putMapping()
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
            await client.index({
              index: 'reviews',
              id,
              body: {
                id,
                reviews,
              },
            })
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
