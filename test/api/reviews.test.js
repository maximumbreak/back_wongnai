const mongoose = require('mongoose')
const request = require('supertest')
import ReviewsModel from '../../src/schema/reviews'
import { getReviews, updateReviews } from '../../src/api/reviews'
import { mock } from '../mock/data'
import { mockResponse } from '../mock/response'

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
})
