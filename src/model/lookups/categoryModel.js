import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  nameAlias: {
    type: String,
    validate: {
      validator: (v) => /^[a-z0-9\-]+$/.test(v),
      message:
        "nameAlias must be lowercase, without spaces, and can include hyphens!",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("category", categorySchema);
