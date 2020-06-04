import express from 'express'
import { getReviews, updateReviews } from '../api/reviews'
let router = express.Router()

router.get('/reviews', getReviews)
router.get('/reviews/:id', getReviews)
router.put('/reviews/:id', updateReviews)

export default router
