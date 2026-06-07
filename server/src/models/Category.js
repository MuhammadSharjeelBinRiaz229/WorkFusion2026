import mongoose, { Schema } from "mongoose";

const CategorySchema = new Schema({
  name: { type: String, required: true, unique: true, index: true },
  description: { type: String },
  icon: { type: String, default: "" },
  parentCategory: { type: Schema.Types.ObjectId, ref: "Category" },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
  },
});

export const Category = mongoose.model("Category", CategorySchema);
