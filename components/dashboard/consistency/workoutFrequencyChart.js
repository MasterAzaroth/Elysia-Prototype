"use client";

import { computeWorkoutFrequency } from "@/lib/consistencyAnalytics";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function WorkoutFrequencyChart({ exerciseLogs }) {

  const data = computeWorkoutFrequency(exerciseLogs, 8);

  const maxWorkouts = data.reduce(
    (max, d) => Math.max(max, d.workouts || 0),
    0
  );
  const yMax = Math.max(maxWorkouts + 1, 3);

  return (
    <div className="w-full bg-brand-grey2 rounded-3xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-center">
        <h2 className="text-lg font-semibold">Workout Frequency Over Time</h2>
      </div>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ left: -20, right: 10, top: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />

            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: "#9ca3af" }}
            />

            <YAxis
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              domain={[0, yMax]}
              allowDecimals={false}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#181818",
                border: "1px solid #2d2d2d",
                borderRadius: "12px",
                fontSize: "12px",
              }}
              labelStyle={{ color: "#e5e7eb" }}
              formatter={(v) => [`${v}`, "Workouts"]}
            />

            <Area
              type="monotone"
              dataKey="workouts"
              stroke="#7D5BF8"
              strokeWidth={3}
              fill="#7D5BF8"
              fillOpacity={0.25}
              dot={{
                r: 4,
                stroke: "#7D5BF8",
                strokeWidth: 2,
                fill: "#181818",
              }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
