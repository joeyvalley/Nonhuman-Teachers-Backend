import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  first: String,
  last: String,
  email: String,
  dateOfTrip: Date,
  category: String,
  subCategory: String,
  details: String,
  dateCreated: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: 'pending', // Every new report starts as 'pending'
    enum: ['pending', 'approved', 'rejected'] // Allowed status values
  }
});

export default mongoose.model('Report', reportSchema);

