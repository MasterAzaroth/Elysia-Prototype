import mongoose from "mongoose";

const UserProfileSchema = new mongoose.Schema(
  {
    user_name: { type: String, required: true },
    gender: { type: String, enum: ["male", "female"], required: true },
    birth: { type: String },
    age: { type: Number, required: true },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    email: { type: String, required: true, unique: true },

    nutritional_goal: {
      type: String,
      enum: ["bulk", "cut", "maintain", "recomp"],
      required: true,
    },
    nutritional_preference: { type: String, default: "high protein" },

    training_focus: { type: String, default: "hybrid" },
    activity_level: { type: Number, min: 1, max: 5, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.UserProfile ||
  mongoose.model("UserProfile", UserProfileSchema);
