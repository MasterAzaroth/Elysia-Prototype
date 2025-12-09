import DNav from "@/components/dashboard/dashboardNav.js";
import dbConnect from "@/lib/mongodb.js";
import ExerciseLog from "@/models/exerciseLog.js";
import FoodLog from "@/models/foodLog.js";
import UserProfile from "@/models/userProfile.js";

import { calculateNutritionTargets } from "@/lib/nutritionCalculator.js";

import StreakCard from "@/components/dashboard/consistency/streakCard.js";
import LastWeekCard from "@/components/dashboard/consistency/lastWeekCard.js";
import ConsistencyCalendar from "@/components/dashboard/consistency/consistencyCalendar.js";
import WorkoutFrequencyChart from "@/components/dashboard/consistency/workoutFrequencyChart.js";

export default async function DashboardConsistencyPage() {
  await dbConnect();

  const user = await UserProfile.findOne({
    email: "test@sample.com",
  }).lean();

  const exerciseLogs = await ExerciseLog.find({})
    .sort({ date: 1 })
    .lean();

  const foodLogs = await FoodLog.find({})
    .sort({ loggedAt: 1 })
    .lean();

  const plainExercise = JSON.parse(JSON.stringify(exerciseLogs));
  const plainFood = JSON.parse(JSON.stringify(foodLogs));

  const targets = calculateNutritionTargets(user || {});

  return (
    <div className="min-h-screen w-full bg-brand-grey1 text-white">
      <DNav />
      <div className="w-full h-[1px] bg-brand-grey3 mt-6" />

      <main className="w-full max-w-5xl mx-auto px-4 py-4 space-y-4">
        <div className="w-full flex justify-center">
          <h1 className="text-2xl font-semibold mb-1">
            Consistency Dashboard
          </h1>
        </div>

        <StreakCard
          exerciseLogs={plainExercise}
          foodLogs={plainFood}
          targets={targets}
        />

        <LastWeekCard
          exerciseLogs={plainExercise}
          foodLogs={plainFood}
          targets={targets}
        />

        <WorkoutFrequencyChart exerciseLogs={plainExercise} />

        <ConsistencyCalendar
          exerciseLogs={plainExercise}
          foodLogs={plainFood}
          targets={targets}
        />
      </main>
    </div>
  );
}
