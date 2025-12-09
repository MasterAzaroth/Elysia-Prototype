"use client";

import { getTodayStats } from "@/lib/nutritionAnalytics";

export default function DailyStatusCard({ logs, targets }) {
  const stats = getTodayStats(logs, targets || {});
  const safeTargets = {
    protein: targets?.protein || 0,
    carbs: targets?.carbs || 0,
    fat: targets?.fat || 0,
    calorieTarget: targets?.calorieTarget || 0,
  };

  return (
    <div className="w-full h-40 bg-brand-grey2 rounded-3xl p-4 flex flex-col justify-between">

      <div className="flex justify-center">
        <h2 className="text-lg font-semibold">Daily Status</h2>
      </div>


      <div className="flex flex-col items-center gap-1">
        <div className="flex gap-2">
          <p className="text-xs text-brand-grey5">Calories</p>
          <p className="text-xs leading-none">
            {stats.calories}
            <span className="text-xs font-normal ml-1">
              / {safeTargets.calorieTarget} kcal
            </span>
          </p>
        </div>

      </div>

      <div className="mt-3 flex flex-col gap-1 text-[11px] text-brand-grey5">
        <div className="flex justify-between">
          <span>Protein</span>
          <span>
            {stats.protein}g / {safeTargets.protein}g
          </span>
        </div>
        <div className="flex justify-between">
          <span>Carbs</span>
          <span>
            {stats.carbs}g / {safeTargets.carbs}g
          </span>
        </div>
        <div className="flex justify-between">
          <span>Fat</span>
          <span>
            {stats.fat}g / {safeTargets.fat}g
          </span>
        </div>
      </div>
    </div>
  );
}
