"use client";

import { useEffect, useState } from "react";
import { getLastMealInfo } from "@/lib/nutritionAnalytics";

function diffHours(from, to) {
  const ms = to - from;
  const hours = ms / (1000 * 60 * 60);
  return Math.max(hours, 0);
}

export default function MealTimerCard({ logs }) {
  const lastMeal = getLastMealInfo(logs);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  let hoursSince = null;
  if (lastMeal) {
    hoursSince = diffHours(lastMeal.time, now);
  }

  return (
    <div className="w-full h-40 bg-brand-grey2 rounded-3xl p-4 flex flex-col items-center justify-center">

      <h2 className="text-lg font-semibold mb-3 text-center mb-auto">Meal Timer</h2>

      {!lastMeal ? (
        <p className="text-sm text-brand-grey5 text-center">
          No meals tracked yet.
        </p>
      ) : (
        <div className="flex flex-col items-center gap-2 mb-auto">

          <p className="text-3xl font-semibold leading-none">
            {hoursSince.toFixed(1)}
            <span className="text-base font-normal ml-1">hours</span>
          </p>

          <p className="text-xs text-brand-grey5">since last meal</p>
        </div>
      )}
    </div>
  );
}