"use client";

import {
  computeTrainingStreak,
  computeNutritionStreak,
} from "@/lib/consistencyAnalytics";

export default function StreakCard({
  exerciseLogs,
  foodLogs,
  targets,
}) {
  const training = computeTrainingStreak(exerciseLogs);
  const nutrition = computeNutritionStreak(
    foodLogs,
    targets.calorieTarget
  );

  return (
    <div className="w-full bg-brand-grey2 rounded-3xl p-4 flex flex-col gap-4">
        <div className="w-full flex justify-center">
            <h2 className="text-lg font-semibold">
                Consistency Streaks
            </h2>
        </div>

      <div className="flex gap-6 px-2">
        <StreakBox
          title="Training"
          current={training.current}
          best={training.best}
        />
        <StreakBox
          title="Nutrition"
          current={nutrition.current}
          best={nutrition.best}
        />
      </div>
    </div>
  );
}

function StreakBox({ title, current, best }) {
  return (
    <div className="w-1/2 h-auto bg-brand-grey3 rounded-2xl py-2 flex flex-col gap-1 items-center">
      <p className="text-xs text-brand-grey5">{title}</p>
      <p className="text-3xl font-semibold leading-none">
        {current}
        <span className="text-base font-normal ml-1">
          days
        </span>
      </p>
      <p className="text-[11px] text-brand-grey5">
        Best streak:{" "}
        <span className="font-medium">{best} days</span>
      </p>
    </div>
  );
}