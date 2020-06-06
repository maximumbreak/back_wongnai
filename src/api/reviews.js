import Reviews from '../schema/reviews'
import { SECRET_KEY, JSON_RESPONSE, EXPIRE } from '../constants'
import { client } from '../utils/els'

const keyIndex = process.env.NODE_ENV === 'test' ? 'reviews_test' : 'reviews'

const getReviews = async (req, res) => {
  try {
    if (req.query.query) {
      const { query } = req.query
      /// USE MONGO ///
      // const result = await Reviews.find({
      //   //reviews: { $regex: query, $options: 'i' },
      //   //reviews: { $regex: query },
      //   $text: { $search: query },
      // })
      /// END USE MONGO ///

      /// USE ELASTICSEARCH ///
      const result = await getSearch(query)
      const searchRegExp = new RegExp(query, 'g')
      const replaceWith = `<keyword>${query}</keyword>`
      result.map((items) => {
        items.reviews = items.reviews.replace(searchRegExp, replaceWith)
      })

      res.status(JSON_RESPONSE.OK.code).json(result)
    } else if (req.params.id) {
      const { id } = req.params
      const result = await Reviews.findOne({
        id,
      })
      res.status(200).json(result)
    }
  } catch (e) {
    res.status(JSON_RESPONSE.ERROR.code).json(JSON_RESPONSE.ERROR.message)
  }
}

const updateReviews = async (req, res) => {
  try {
    if (req.params.id) {
      const { id } = req.params
      const result = await Reviews.updateOne(
        {
          id,
        },
        {
          reviews: req.body.reviews,
        }
      )
      await putReviews(id, req.body.reviews)
      res.status(JSON_RESPONSE.OK.code).json(result)
      return
    }
    res.status(JSON_RESPONSE.BAD_REQUEST.code).json(JSON_RESPONSE.BAD_REQUEST)
  } catch (e) {
    return res
      .status(JSON_RESPONSE.ERROR.code)
      .json(JSON_RESPONSE.ERROR.message)
  }
}

async function getSearch(input) {
  const result = await client.search({
    index: keyIndex,
    size: 10000,
    body: {
      query: {
        regexp: {
          reviews: {
            value: `.*${input}.*`,
            flags: 'ALL',
            max_determinized_states: 10000,
            rewrite: 'constant_score',
          },
        },
      },
    },
  })
  const hits = result.hits.hits.map((hit) => hit._source)
  return hits
}

async function putReviews(id, reviews) {
  await client.update({
    index: keyIndex,
    id,
    body: {
      doc: {
        reviews: reviews,
      },
    },
  })
  return
}
export { getReviews, updateReviews }
