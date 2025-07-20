import mongoose from "mongoose";

const publisherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  nameAlias: {
    type: String,
    unique: true,
    trim: true,
    validate: {
      validator: function (value) {
        return /^[a-zA-Z0-9-]+$/.test(value);
      },
      message:
        "nameAlias must be lowercase, without spaces, and can include hyphens!",
    },
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
