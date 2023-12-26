import mongoose, { Schema } from "mongoose";

const ElementSchema = new Schema({
  view_id: {
    type: String,
    required: [true, "Provide ID for the view"],
  },
  name: {
    type: String,
    required: [true, "Provide a name for the element"],
  },
  type: {
    type: Number,
    required: [true, "Provide a type for the element"],
  },
  position: {
    type: Number,
    required: [true, "Provide a position for the element"],
  },
  text: String,
  video_link: String,
  image_link: String,
  button_link: String,
  link_group: [Object],
  created_at: {
    type: Schema.Types.Date,
    required: [true, "Element require date created"],
  },
});

export default mongoose.models.Element ??
  mongoose.model("Element", ElementSchema);
