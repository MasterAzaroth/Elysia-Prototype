"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DNav from "@/components/dashboard/dashboardNav.js";
import DailyStatusCard from "@/components/dashboard/nutrition/dailyStatusCard.js";
import MealTimerCard from "@/components/dashboard/nutrition/mealTimerCard.js";
import WeeklyAdherenceChart from "@/components/dashboard/nutrition/weeklyAdherenceChart.js";
import MacroAdherenceCard from "@/components/dashboard/nutrition/macroAdherenceCard.js";
import { calculateNutritionTargets } from "@/lib/nutritionCalculator.js";

export default function DashboardNutritionPage() {
  const router = useRouter();
  const [data, setData] = useState({ user: null, logs: [], targets: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("elysia_user_id");
    if (!userId) {
      router.push("/login");
      return;
    }

    async function fetchAll() {
      try {
        const [userRes, logsRes] = await Promise.all([
          fetch(`/api/user/profile?userId=${userId}`),
          fetch(`/api/foodLog?userId=${userId}`)
        ]);

        const userData = await userRes.json();
        const logsData = await logsRes.json();

        if (userData.success) {

          const targets = calculateNutritionTargets(userData.user);
          setData({
            user: userData.user,
            logs: Array.isArray(logsData) ? logsData : [],
            targets
          });
        }
      } catch (err) {
        console.error("Error loading dashboard:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-brand-grey1 flex items-center justify-center text-brand-grey5">
        Loading Nutrition Data...
      </div>
    );
  }

  const safeTargets = data.targets || { calorieTarget: 2000, protein: 150, carbs: 250, fat: 60 };

  return (
    <div className="min-h-screen w-full bg-brand-grey1 text-white">
      <DNav />
      <div className="w-full h-[1px] bg-brand-grey3 mt-6" />

      <main className="w-full max-w-5xl mx-auto px-4 py-4 space-y-4">
        <div className="w-full flex flex-col items-center gap-2">
          <h1 className="text-2xl font-semibold mt-2">Nutrition Dashboard</h1>
          {data.user && (
            <div className="text-sm mb-2 flex flex-col items-center">
              <p>
                Targets for <span className="font-medium">{data.user.user_name}</span>
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="uppercase tracking-wide text-brand-grey4">
                  {data.user.nutritional_goal}
                </span>
                <span className="w-1 h-1 rounded-full bg-brand-purple1"></span>
                <span className="uppercase text-brand-grey4">
                  Activity lvl. {data.user.activity_level}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <div className="w-full md:w-1/2">
            <DailyStatusCard logs={data.logs} targets={safeTargets} />
          </div>
          <div className="w-full md:w-1/2">
            <MealTimerCard logs={data.logs} />
          </div>
        </div>

        <div className="w-full">
          <WeeklyAdherenceChart logs={data.logs} targets={safeTargets} />
        </div>

        <div className="w-full">
          <MacroAdherenceCard logs={data.logs} targets={safeTargets} />
        </div>
      </main>
    </div>
  );
}
