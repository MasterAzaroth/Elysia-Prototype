"use client";

import { computeMuscleSetDistributionLast8Weeks } from "@/lib/trainingAnalytics";
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

export default function MuscleDistribution({ logs }) {
  const data = computeMuscleSetDistributionLast8Weeks(logs);

  return (
    <div className="bg-brand-grey2 rounded-3xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Volume by Muscle</h2>
        <span className="text-xs text-brand-grey5">
          Avg vs last week · sets
        </span>
      </div>

      {data.length === 0 ? (
        <p className="text-sm text-brand-grey5">
          No sets logged in the last 8 weeks.
        </p>
      ) : (
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ left: -20, right: 10, top: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />
              <XAxis
                dataKey="muscle"
                tick={{ fontSize: 10, fill: "#9ca3af" }}
              />
              <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#181818",
                  border: "1px solid #2d2d2d",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
                labelStyle={{ color: "#e5e7eb" }}
                formatter={(v, name) => [`${v} sets`, name]}
              />
              <Legend
                wrapperStyle={{ fontSize: 11 }}
                formatter={(value) =>
                  value === "avgSets" ? "Avg / week" : "Last week"
                }
              />
              <Bar
                dataKey="avgSets"
                name="Avg / week"
                radius={[4, 4, 0, 0]}
                barSize={16}
                fill="#7D5BF8"
              />
              <Bar
                dataKey="lastWeekSets"
                name="Last week"
                radius={[4, 4, 0, 0]}
                barSize={16}
                fill="#A78BFA"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
