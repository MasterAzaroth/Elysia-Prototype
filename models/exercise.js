import mongoose from "mongoose";

const ExerciseSchema = new mongoose.Schema(
  {

    Exercise: {
      type: String,
      required: true,
      trim: true,
    },

    Muscle: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Exercise ||
  mongoose.model("Exercise", ExerciseSchema);
