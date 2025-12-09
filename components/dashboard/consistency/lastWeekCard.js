"use client";

import {
  computeLastWeekSummary,
  computeLastWeekWorkoutTypes,
} from "@/lib/consistencyAnalytics";

export default function LastWeekCard({ exerciseLogs, foodLogs, targets }) {
  const summary = computeLastWeekSummary(
    exerciseLogs,
    foodLogs,
    targets
  );
  const topTypes = computeLastWeekWorkoutTypes(exerciseLogs);

  return (
    <div className="w-full bg-brand-grey2 rounded-3xl flex flex-col gap-4">

      <h2 className="text-lg font-semibold text-center mt-4">
        Last Week Overview
      </h2>

      <div className="flex gap-4 px-4 pb-4">

        <div className="w-1/2 bg-brand-grey3 rounded-2xl p-3 flex flex-col gap-3">
          <p className="text-sm">Top workouts</p>

          {topTypes.length > 0 ? (
            <ul className="flex flex-col gap-1 mt-1 text-xs">
              {topTypes.map((name, idx) => (
                <li
                  key={name + idx}
                  className="flex items-baseline gap-2"
                >
                  <span className="text-[11px] text-brand-grey5">
                    {idx + 1}.
                  </span>
                  <span>{name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-brand-grey5">
              No workouts logged.
            </p>
          )}

          <p className="text-xs mt-2">
            Total workouts:{" "}
            <span className="font-medium">
              {summary.workouts}
            </span>
          </p>
        </div>

        <div className="w-1/2 bg-brand-grey3 rounded-2xl p-3 flex flex-col gap-3">
          <p className="text-sm">Macro adherence</p>

          <div className="flex flex-col gap-2 mt-1 text-xs">
            <MacroLine label="Calories" pct={summary.caloriePct} />
            <MacroLine label="Protein" pct={summary.proteinPct} />
            <MacroLine label="Carbs" pct={summary.carbsPct} />
            <MacroLine label="Fat" pct={summary.fatPct} />
          </div>
        </div>
      </div>
    </div>
  );
}

function MacroLine({ label, pct }) {
  let color = "text-brand-grey5";

  if (pct < 80) color = "text-red-400";
  else if (pct <= 110) color = "text-emerald-400";
  else color = "text-yellow-400";

  return (
    <div className="flex justify-between items-baseline">
      <span>{label}</span>
      <span className={color}>{pct}%</span>
    </div>
  );
}
