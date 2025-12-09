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
    targets?.calorieTarget
  );

  const calorieGoal = Number(targets?.calorieTarget) || 0;

  const maxValue = data.reduce(
    (max, d) => Math.max(max, d.avgCalories || 0, d.lastWeekCalories || 0),
    0
  );

  let yMax;
  if (maxValue === 0) {

    yMax = calorieGoal > 0 ? Math.max(Math.round(calorieGoal * 1.2), 1500) : 1500;
  } else {
    yMax = Math.max(Math.round(maxValue * 1.2), 1500);
  }

  return (
    <div className="w-full bg-brand-grey2 rounded-3xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">Weekly Adherence</h2>
        <span className="text-xs text-brand-grey5">
          Avg vs last week · kcal
        </span>
      </div>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ left: -20, right: 10, top: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" vertical={false} />
            <XAxis
              dataKey="weekday"
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              tickFormatter={(v) => `${v}`}
              domain={[0, yMax]}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: "#2d2d2d", opacity: 0.4 }}
              contentStyle={{
                backgroundColor: "#181818",
                border: "1px solid #2d2d2d",
                borderRadius: "12px",
                fontSize: "12px",
                color: "#fff"
              }}
              labelStyle={{ color: "#e5e7eb", marginBottom: "0.5rem" }}
              formatter={(v, name) => {
                if (name === "avgCalories") return [`${v} kcal`, "Avg (8 weeks)"];
                if (name === "lastWeekCalories") return [`${v} kcal`, "Last 7 days"];
                return v;
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 11, paddingTop: "10px" }}
              formatter={(value) => (value === "avgCalories" ? "Avg" : "Last week")}
            />
            <Bar
              dataKey="avgCalories"
              name="Avg"
              barSize={12}
              radius={[4, 4, 0, 0]}
              fill="#7D5BF8"
            />
            <Bar
              dataKey="lastWeekCalories"
              name="Last week"
              barSize={12}
              radius={[4, 4, 0, 0]}
              fill="#A78BFA"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}