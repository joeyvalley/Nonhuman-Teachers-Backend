import mongoose from "mongoose"

const reportSchema = new mongoose.Schema({
  first: String,
  last: String,
  email: String,
  dateOfTrip: Date,
  category: String,
  subCategory: String,
  details: String,
  dateCreated: Date
})

export default mongoose.model('Report', reportSchema);