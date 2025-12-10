"use client";

import { useMemo } from "react";
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

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-neutral-900 border border-white/10 p-3 rounded-xl shadow-xl">
        <p className="text-white font-semibold text-xs mb-2">{label}</p>
        <div className="flex flex-col gap-1">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: entry.fill }}
              />
              <span className="text-gray-300">
                {entry.name}: <span className="text-white font-medium">{entry.value}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function MuscleDistribution({ logs }) {

  const data = useMemo(() => computeMuscleSetDistributionLast8Weeks(logs), [logs]);

  return (
    <div className="bg-brand-grey2 rounded-3xl p-4 flex flex-col gap-3 h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Volume by Muscle</h2>
        <span className="text-xs text-brand-grey5">
          Sets: Last Week vs 8-Week Avg
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
            <BarChart
              data={data}
              margin={{ left: -25, right: 0, top: 10, bottom: 0 }}
              barGap={2}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#ffffff" 
                opacity={0.05} 
                vertical={false} 
              />
              
              <XAxis
                dataKey="muscle"
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
                interval={0}
              />
              
              <YAxis 
                tick={{ fontSize: 10, fill: "#9ca3af" }} 
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'white', opacity: 0.05 }} />
              
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ fontSize: 10, paddingBottom: 10 }}
              />

              <Bar
                dataKey="avgSets"
                name="Avg / Week"
                fill="#4b5563"
                radius={[4, 4, 4, 4]}
                barSize={8}
              />

              <Bar
                dataKey="lastWeekSets"
                name="Last Week"
                fill="#7D5BF8"
                radius={[4, 4, 4, 4]}
                barSize={8}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}