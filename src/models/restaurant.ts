import mongoose, { Schema } from "mongoose";

const RestaurantSchema = new Schema({
  name: {
    type: String,
    required: [true, "Restaurant name required"],
  },
  image: {
    type: String,
    required: [true, "Restaurant image required!"],
  },
  admin_ids: {
    type: [String],
    required: [true, "Restaurant admin list needed"],
  },
  description: String,
  created_at: {
    type: Schema.Types.Date,
    required: [true, "Element require date created"],
    default: Date.now(),
  },
});

export default mongoose.models.Restaurant ??
  mongoose.model("Restaurant", RestaurantSchema);
