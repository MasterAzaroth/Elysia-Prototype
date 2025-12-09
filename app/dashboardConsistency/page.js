"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DNav from "@/components/dashboard/dashboardNav.js";
import StreakCard from "@/components/dashboard/consistency/streakCard.js";
import LastWeekCard from "@/components/dashboard/consistency/lastWeekCard.js";
import ConsistencyCalendar from "@/components/dashboard/consistency/consistencyCalendar.js";
import WorkoutFrequencyChart from "@/components/dashboard/consistency/workoutFrequencyChart.js";

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

export default function DashboardConsistencyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    exerciseLogs: [],
    foodLogs: [],
    targets: calculateGoals(null)
  });

  useEffect(() => {
    const userId = localStorage.getItem("elysia_user_id");
    if (!userId) {
      router.push("/login");
      return;
    }

    async function fetchAll() {
      try {
        const [userRes, foodRes, exRes] = await Promise.all([
          fetch(`/api/user/profile?userId=${userId}`),
          fetch(`/api/foodLog?userId=${userId}`),
          fetch(`/api/exerciseLogs?userId=${userId}`)
        ]);

        const userData = await userRes.json();
        const foodData = await foodRes.json();
        const exData = await exRes.json();

        if (userData.success) {
          const targets = calculateGoals(userData.user);

          const rawExercise = Array.isArray(exData) 
            ? exData 
            : (exData.logs || exData.data || []);
            
          const rawFood = Array.isArray(foodData) 
            ? foodData 
            : (foodData.logs || foodData.data || []);

          const exerciseLogs = rawExercise.map(log => ({
            ...log,
            date: new Date(log.date)
          }));

          const foodLogs = rawFood.map(log => ({
            ...log,

            date: log.day ? new Date(log.day) : new Date(log.loggedAt || log.createdAt)
          }));

          setData({
            exerciseLogs,
            foodLogs,
            targets
          });
        }
      } catch (err) {
        console.error("Error loading consistency data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-brand-grey1 flex items-center justify-center text-brand-grey5">
        Loading Consistency Data...
      </div>
    );
  }

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
          exerciseLogs={data.exerciseLogs}
          foodLogs={data.foodLogs}
          targets={data.targets}
        />

        <LastWeekCard
          exerciseLogs={data.exerciseLogs}
          foodLogs={data.foodLogs}
          targets={data.targets}
        />

        <WorkoutFrequencyChart exerciseLogs={data.exerciseLogs} />

        <ConsistencyCalendar
          exerciseLogs={data.exerciseLogs}
          foodLogs={data.foodLogs}
          targets={data.targets}
        />
      </main>
    </div>
  );
}