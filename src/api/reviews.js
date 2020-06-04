import Reviews from '../schema/reviews'
import { SECRET_KEY, JSON_RESPONSE, EXPIRE } from '../constants'

const getReviews = async (req, res) => {
  try {
    if (req.query.query) {
      const { query } = req.query
      const result = await Reviews.find({
        reviews: { $regex: query, $options: 'i' },
        //$text: { $search: 'ข้าวผัด' }
      })
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
    // console.log('err=>', e)
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

export { getReviews, updateReviews }
