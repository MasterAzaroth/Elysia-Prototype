import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserProfileSchema = new mongoose.Schema(
  {
    user_name: { type: String, required: true },
    gender: { type: String, enum: ["male", "female"], required: true },
    birth: { type: String },
    age: { type: Number, required: true },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    nutritional_goal: {
      type: String,
      enum: ["bulk", "cut", "maintain", "recomp"],
      required: true,
    },
    nutritional_preference: { type: String, default: "high protein" },

    training_focus: { type: String, default: "hybrid" },
    activity_level: { type: Number, min: 1, max: 5, required: true },

    weekly_workout_frequency: { type: Number, default: 0 },
  },
  { timestamps: true }
);

UserProfileSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

UserProfileSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.models.UserProfile ||
  mongoose.model("UserProfile", UserProfileSchema);
