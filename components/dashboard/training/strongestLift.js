"use client";

import { computeStrongestLiftLast7Days } from "@/lib/trainingAnalytics";

export default function StrongestLift({ logs }) {
  const strongest = computeStrongestLiftLast7Days(logs);

  return (
    <div className="bg-brand-grey2 rounded-3xl p-4 flex flex-col justify-between items-stretch h-full">

      <div className="w-full flex flex-col items-center">
        <h2 className="text-lg font-semibold">Strongest Lift</h2>
        <span className="text-xs text-brand-grey4 mt-2">Last 7 days</span>
      </div>

      {!strongest ? (
        <p className="text-sm mt-4">
          No heavy sets logged this week.
        </p>
      ) : (
        <div className="flex flex-col items-center gap-3 mt-5">

          <p className="text-3xl font-semibold leading-none text-center">
            {strongest.estimated1RM}
            <span className="text-base font-normal ml-1">kg</span>
          </p>

          <p className="text-xs font-medium text-center leading-snug">
            {strongest.exerciseTitle || "Exercise"}
          </p>

        </div>
      )}
    </div>
  );
}
