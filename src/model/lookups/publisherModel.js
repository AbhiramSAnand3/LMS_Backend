import mongoose from "mongoose";

const publisherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  website: {
    type: String,
    trim: true,
  },
  contactEmail: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  foundedYear: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("publisher", publisherSchema);
