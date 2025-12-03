import mongoose from "mongoose";

const EntrySchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  type: { type: String, required: true },
  gist: { type: String, required: true},
  definition: { type: String, required: true},
  icon: { type: String, default: "Landmark" },
  letter: { type: String, required: true},
});

export default mongoose.models.Entry || mongoose.model("Entry", EntrySchema);