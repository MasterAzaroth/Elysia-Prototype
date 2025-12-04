import mongoose from "mongoose";

const FoodLogSchema = new mongoose.Schema(
  {

    userId: {
      type: String,
      default: "demo-user",
      index: true,
    },

    food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
      required: true,
    },

    foodName: { type: String, required: true },

    grams: { type: Number, required: true },

    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true },

    loggedAt: { type: Date, default: Date.now },
    day: { type: String, index: true },
    time: { type: String },
  },
  { timestamps: true }
);

FoodLogSchema.pre("save", function (next) {
  if (this.loggedAt && (!this.day || !this.time)) {
    const d = new Date(this.loggedAt);

    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    this.day = this.day || `${yyyy}-${mm}-${dd}`;

    const hh = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    this.time = this.time || `${hh}:${min}`;
  }

  next();
});

export default mongoose.models.FoodLog ||
  mongoose.model("FoodLog", FoodLogSchema, "foodLogs");
