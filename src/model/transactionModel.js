import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    reader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "reader",
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "book",
      required: true,
    },
    transactionType: {
      type: String,
      required: true,
    },
    transactionDate: {
      type: Date,
      default: Date.now,
    },
    amount: {
      type: Number,
      required: true,
    },
    transactionId: {
      type: String,
      unique: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    fineReason: {
      type: String,
    },
    note: {
      type: String,
    },
    status: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

transactionSchema.pre(/^find/, function (next) {
  this.populate({
    path: "reader",
    select: "firstName lastName memberShipId",
  }).populate({
    path: "book",
    select: "title author isbn genre category",
  });
  next();
});

export default mongoose.model("transaction", transactionSchema);
