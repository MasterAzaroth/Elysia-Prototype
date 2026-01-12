"use client";

import { computeWeeklySetVolumeLast8Weeks } from "@/lib/trainingAnalytics";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function VolumeOverTime({ logs }) {
  const data = computeWeeklySetVolumeLast8Weeks(logs);

  return (
    <div className="bg-brand-grey2 rounded-3xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Volume Over Time</h2>
        <span className="text-xs text-brand-grey5">
          Weekly sets · last 8 weeks
        </span>
      </div>

      {data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center min-h-[200px]">
          <p className="text-sm text-brand-grey5">
            No data available for the last 8 weeks.
          </p>
        </div>
      ) : (
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ left: -20, right: 10, top: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: "#9ca3af" }}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                tickFormatter={(v) => `${v}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#181818",
                  border: "1px solid #2d2d2d",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
                labelStyle={{ color: "#e5e7eb" }}
                formatter={(value) => [`${value} sets`, "Volume"]}
              />
              <Area
                type="monotone"
                dataKey="sets"
                stroke="#7D5BF8"
                fill="#7D5BF8"
                fillOpacity={0.2}
                strokeWidth={2}
                dot={{ r: 4, stroke: "#7D5BF8", fill: "#7D5BF8" }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
