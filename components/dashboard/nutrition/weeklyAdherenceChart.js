"use client";

import { computeWeeklyCaloriesByWeekday } from "@/lib/nutritionAnalytics";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

export default function WeeklyAdherenceChart({ logs, targets }) {
  const data = computeWeeklyCaloriesByWeekday(
    logs,
    targets.calorieTarget
  );

  const hasAnyLogs = Array.isArray(logs) && logs.length > 0;
  const hasAnyValues = data.some(
    (d) =>
      (d.avgCalories && d.avgCalories > 0) ||
      (d.lastWeekCalories && d.lastWeekCalories > 0)
  );

  const calorieGoal = Number(targets?.calorieTarget) || 0;

  const maxValue = data.reduce(
    (max, d) =>
      Math.max(max, d.avgCalories || 0, d.lastWeekCalories || 0),
    0
  );

  let yMax;

  if (maxValue === 0) {

    if (calorieGoal > 0) {
      yMax = Math.max(Math.round(calorieGoal * 1.2), 1500);
    } else {
      yMax = 1500;
    }
  } else {

    yMax = Math.max(Math.round(maxValue * 1.2), 1500);
  }

  return (
    <div className="w-full bg-brand-grey2 rounded-3xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Weekly Adherence</h2>
        <span className="text-xs text-brand-grey5">
          Avg vs last week · kcal
        </span>
      </div>

      {!hasAnyLogs ? (
        <p className="text-sm text-brand-grey5">
          Not enough tracked meals to compute adherence yet.
        </p>
      ) : (
        <>
          {!hasAnyValues && (
            <p className="text-[11px] text-brand-grey5">
              No calorie values found for the last weeks — check that your
              food logs store calories correctly.
            </p>
          )}

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ left: -20, right: 10, top: 10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />
                <XAxis
                  dataKey="weekday"
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  tickFormatter={(v) => `${v}`}
                  domain={[0, yMax]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#181818",
                    border: "1px solid #2d2d2d",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                  labelStyle={{ color: "#e5e7eb" }}
                  formatter={(v, name) => {
                    if (name === "avgCalories") {
                      return [`${v} kcal`, "Avg (last 8 weeks)"];
                    }
                    if (name === "lastWeekCalories") {
                      return [`${v} kcal`, "Last 7 days"];
                    }
                    return v;
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 11 }}
                  formatter={(value) =>
                    value === "avgCalories" ? "Avg" : "Last week"
                  }
                />
                <Bar
                  dataKey="avgCalories"
                  name="Avg"
                  barSize={14}
                  radius={[4, 4, 0, 0]}
                  fill="#7D5BF8"
                />
                <Bar
                  dataKey="lastWeekCalories"
                  name="Last week"
                  barSize={14}
                  radius={[4, 4, 0, 0]}
                  fill="#A78BFA"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
