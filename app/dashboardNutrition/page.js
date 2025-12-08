import DNav from "@/components/dashboard/dashboardNav.js";
import dbConnect from "@/lib/mongodb.js";
import UserProfile from "@/models/userProfile.js";
import FoodLog from "@/models/foodLog.js";

import { calculateNutritionTargets } from "@/lib/nutritionCalculator.js";

import DailyStatusCard from "@/components/dashboard/nutrition/dailyStatusCard.js";
import MealTimerCard from "@/components/dashboard/nutrition/mealTimerCard.js";
import WeeklyAdherenceChart from "@/components/dashboard/nutrition/weeklyAdherenceChart.js";
import MacroAdherenceCard from "@/components/dashboard/nutrition/macroAdherenceCard.js";

export default async function DashboardNutritionPage() {
  await dbConnect();

  const user = await UserProfile.findOne({ email: "test@sample.com" }).lean();

  const foodLogs = await FoodLog.find({}).sort({ date: 1 }).lean();
  const plainLogs = JSON.parse(JSON.stringify(foodLogs));

  const targets = calculateNutritionTargets(user || {});

  return (
    <div className="min-h-screen w-full bg-brand-grey1 text-white">
      <DNav />
      <div className="w-full h-[1px] bg-brand-grey3 mt-6" />

      <main className="w-full max-w-5xl mx-auto px-4 py-4 space-y-4">
        <div className="w-full flex flex-col items-center gap-2">
          <h1 className="text-2xl font-semibold mt-2">Nutrition Dashboard</h1>
          {user ? (
            <div className="text-sm mb-2 flex flex-col items-center">
              <p>
                Targets calculated for{" "}
                <span className="font-medium">{user.user_name}</span>
              </p>

              <div className="flex items-center gap-2 mt-1">

                <span className="uppercase tracking-wide text-brand-grey4">
                  {user.nutritional_goal}
                </span>

                <span className="w-1 h-1 rounded-full bg-brand-purple1"></span>

                <span className="uppercase text-brand-grey4">
                  Activity lvl. {user.activity_level}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-red-400 mb-2">
              No user profile found for email: test@sample.com
            </p>
          )}

        </div>

        <div className="flex md:flex-row gap-4">
          <div className="w-full md:w-1/2 md:aspect-square">
            <DailyStatusCard logs={plainLogs} targets={targets} />
          </div>
          <div className="w-full md:w-1/2 md:aspect-square">
            <MealTimerCard logs={plainLogs} />
          </div>
        </div>

        <div className="w-full">
          <WeeklyAdherenceChart logs={plainLogs} targets={targets} />
        </div>

        <div className="w-full">
          <MacroAdherenceCard logs={plainLogs} targets={targets} />
        </div>
      </main>
    </div>
  );
}
