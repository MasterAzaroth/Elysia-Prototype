import mongoose from "mongoose";

const { Schema } = mongoose;

const SetSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["Warm-Up Set", "Working Set"],
      default: "Working Set",
    },
    weight: {
      type: Number,
      default: 0,
    },
    reps: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const ExerciseSchema = new Schema(
  {
    title: { type: String, required: true },
    muscle: { type: String, default: "" },
    imageSrc: { type: String, default: "/Muscle/Upper%20Body/Chest.png" },
    sets: { type: [SetSchema], default: [] },
  },
  { _id: false }
);

const ExerciseLogSchema = new Schema(
  {
    userId: {
      type: String,
      required: true, 
      index: true,
    },
    workoutTitle: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    exercises: {
      type: [ExerciseSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: "exerciseLogs",
  }
);

export default mongoose.models.ExerciseLog ||
  mongoose.model("ExerciseLog", ExerciseLogSchema);