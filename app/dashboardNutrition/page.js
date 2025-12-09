"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DNav from "@/components/dashboard/dashboardNav.js";
import DailyStatusCard from "@/components/dashboard/nutrition/dailyStatusCard.js";
import MealTimerCard from "@/components/dashboard/nutrition/mealTimerCard.js";
import WeeklyAdherenceChart from "@/components/dashboard/nutrition/weeklyAdherenceChart.js";
import MacroAdherenceCard from "@/components/dashboard/nutrition/macroAdherenceCard.js";

function calculateGoals(user) {
  if (!user) return { calorieTarget: 2000, protein: 150, carbs: 250, fat: 60 };

  let bmr = 10 * user.weight + 6.25 * user.height - 5 * user.age;
  bmr += user.gender === "male" ? 5 : -161;

  const multipliers = { 1: 1.2, 2: 1.375, 3: 1.55, 4: 1.725, 5: 1.9 };
  let tdee = bmr * (multipliers[user.activity_level] || 1.2);

  if (user.nutritional_goal === "cut") tdee -= 500;
  else if (user.nutritional_goal === "bulk") tdee += 500;

  let pRatio = 0.3, cRatio = 0.4, fRatio = 0.3;
  if (user.nutritional_preference === "high protein") {
    pRatio = 0.4; cRatio = 0.35; fRatio = 0.25;
  } else if (user.nutritional_preference === "high carb") {
    pRatio = 0.25; cRatio = 0.55; fRatio = 0.2;
  }

  return {
    calorieTarget: Math.round(tdee),
    protein: Math.round((tdee * pRatio) / 4),
    carbs: Math.round((tdee * cRatio) / 4),
    fat: Math.round((tdee * fRatio) / 9),
  };
}

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
          const targets = calculateGoals(userData.user);
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

        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2 aspect-auto min-h-[250px]">
            <DailyStatusCard logs={data.logs} targets={data.targets} />
          </div>
          <div className="w-full md:w-1/2 aspect-auto min-h-[250px]">
            <MealTimerCard logs={data.logs} />
          </div>
        </div>

        <div className="w-full">
          <WeeklyAdherenceChart logs={data.logs} targets={data.targets} />
        </div>

        <div className="w-full">
          <MacroAdherenceCard logs={data.logs} targets={data.targets} />
        </div>
      </main>
    </div>
  );
}