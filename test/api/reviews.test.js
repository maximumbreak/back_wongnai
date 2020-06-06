const mongoose = require('mongoose')
const request = require('supertest')
import ReviewsModel from '../../src/schema/reviews'
import { getReviews, updateReviews } from '../../src/api/reviews'
import { mock } from '../mock/data'
import { mockResponse } from '../mock/response'
import {
  client,
  indexExists,
  deleteIndex,
  initIndex,
} from '../../src/utils/els'

function clearDB() {
  for (var i in mongoose.connection.collections) {
    mongoose.connection.collections[i].remove(function () {})
  }
  return
}

describe('User Model Test', () => {
  beforeAll(async () => {
    await mongoose.connect(
      'mongodb://localhost/wongnai_test',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      (err) => {
        if (err) {
          console.error(err)
          process.exit(1)
        }
      }
    )
    clearDB()

    const resultIndex = await indexExists('reviews_test')
    if (resultIndex) {
      await deleteIndex('reviews_test')
    }
    await initIndex('reviews_test')
    await client.cluster.putSettings({
      body: {
        transient: {
          'cluster.routing.allocation.disk.watermark.low': '20gb',
          'cluster.routing.allocation.disk.watermark.high': '15gb',
          'cluster.routing.allocation.disk.watermark.flood_stage': '10gb',
        },
      },
    })

    /// Use Memory Test ///
    //db = await connection.db()
    // await mongoose.connect(
    //   global.__MONGO_URI__,
    //   { useNewUrlParser: true, useCreateIndex: true },
    //   err => {
    //     if (err) {
    //       console.error(err)
    //       process.exit(1)
    //     }
    //   }
    // )
  })

  it('should create successfully', async () => {
    await ReviewsModel.create(mock)
    await client.index({
      index: 'reviews_test',
      id: mock.id,
      body: {
        id: mock.id,
        reviews: mock.reviews,
      },
    })
    const result = await ReviewsModel.findOne({ id: 1 })
    expect(result.id).toEqual(1)
  })

  it('should get reviews by id 1', async () => {
    const req = {
      query: {},
      params: {
        id: 1,
      },
    }
    const res = mockResponse()
    await getReviews(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    // expect(res.json).toHaveBeenCalledWith({ id: mock.id })
  })

  it('should error get reviews by id 2', async () => {
    const req = {
      query: {},
      params: {},
    }
    const res = mockResponse()
    await getReviews(undefined, res)
    expect(res.status).toHaveBeenCalledWith(500)
    // expect(res.json).toHaveBeenCalledWith({ id: mock.id })
  })

  it('should get reviews by query ร้าน', async () => {
    const req = {
      query: {
        query: 'ร้าน',
      },
      params: {},
    }
    const res = mockResponse()
    await getReviews(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    // expect(res.json).toHaveBeenCalledWith({ id: mock.id })
  })

  it('should updateReviews by id', async () => {
    const req = {
      query: {},
      body: {
        reviews: mock.reviews,
      },
      params: {
        id: 1,
      },
    }
    const res = mockResponse()
    await updateReviews(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
  })

  it('should error updateReviews by id', async () => {
    const req = {
      query: {},
      body: {
        reviews: mock.reviews,
      },
      params: {
        id: 2,
      },
    }
    const res = mockResponse()
    await updateReviews(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
  })
})
