import mongoose from 'mongoose'
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const reviewSchema = new Schema({
  id: { type: Number, index: true },
  reviews: { type: String, trim: true, index: true },
  createdBy: String,
  createdAt: String,
  updateAt: String
})

reviewSchema.index({ reviews: 'text' })

const ReviewModel = mongoose.model('review', reviewSchema)
export default ReviewModel
