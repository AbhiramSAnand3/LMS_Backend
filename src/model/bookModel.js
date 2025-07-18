import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  isbn: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  authors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "author",
      required: true,
    },
  ],
  publisher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "publisher",
  },
  publicationYear: {
    type: Number,
    validate: {
      validator: function (v) {
        return v <= new Date().getFullYear();
      },
      message: (props) => `${props.value} is not a valid publication year!`,
    },
  },
  edition: {
    type: String,
    trim: true,
  },
  genre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "genre",
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
    required: true,
  },
  language: {
    type: String,
    default: "English",
  },
  pageCount: {
    type: Number,
    min: 1,
  },
  description: {
    type: String,
    trim: true,
  },
  coverImage: {
    type: String,
    trim: true,
  },
  totalCopies: {
    type: Number,
    required: true,
    default: 1,
    min: 0,
  },
  availableCopies: {
    type: Number,
    required: true,
    default: 1,
    min: 0,
    validate: {
      validator: function (v) {
        return v <= this.totalCopies;
      },
      message: (props) =>
        `Available copies (${props.value}) cannot exceed total copies (${this.totalCopies})!`,
    },
  },
  shelfLocation: {
    type: String,
    trim: true,
  },
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  isReference: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
bookSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("book", bookSchema);
