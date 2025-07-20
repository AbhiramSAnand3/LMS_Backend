import mongoose from "mongoose";

const genreSchema = new mongoose.Schema({
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
        return /^[a-zA-Z0-9-]*$/.test(value);
      },
      message:
        "nameAlias must be lowercase, without spaces, and can include hyphens!",
    },
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("genre", genreSchema);
