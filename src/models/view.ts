import mongoose, { Schema } from "mongoose";

const ViewSchema = new Schema({
  owner_id: {
    type: String,
    required: [true, "Provide ID for the view owner"],
  },
  name: {
    type: String,
    required: [true, "Provide a name for the element"],
  },
  image: String,
  url: {
    type: String,
    required: [true, "Provide a URL for the view"],
  },
  main_color: String,
  secondary_color: String,
  text_color: String,
  created_at: {
    type: Schema.Types.Date,
    required: [true, "Element require date created"],
  },
});

export default mongoose.models.View ?? mongoose.model("View", ViewSchema);
