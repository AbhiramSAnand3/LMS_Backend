import mongoose from "mongoose";

const readerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: function (value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
      },
      message: "Invalid email format",
    },
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
    match: [
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
      "Invalid phone number",
    ],
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true, default: "India" },
    zipCode: { type: String, required: true },
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  memberShipId: {
    type: String,
    required: true,
    unique: true,
  },
  membershipType: {
    type: String,
    required: true,
  },
  membershipStartDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  membershipEndDate: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  borrowedBooks: [
    {
      bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "book",
        required: true,
      },
      borrowDate: {
        type: Date,
        default: Date.now,
      },
      dueDate: {
        type: Date,
      },
      returnDate: {
        type: Date,
      },
      isReturned: {
        type: Boolean,
        default: false,
      },
      fine: {
        type: Number,
        default: 0,
      },
    },
  ],
  totalFine: {
    type: Number,
    default: 0,
  },
  totalBooksBorrowed: {
    type: Number,
    default: 0,
  },
  isBlacklisted: {
    type: Boolean,
    default: false,
  },
  isBlacklistedReason: {
    type: String,
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

export default mongoose.model("reader", readerSchema);
