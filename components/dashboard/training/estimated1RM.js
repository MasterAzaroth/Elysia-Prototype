"use client";

import { useState, useMemo } from "react";
import { computeMainLift1RMs } from "@/lib/trainingAnalytics";

const OPTIONS = [
  { key: "bench", label: "Bench Press" },
  { key: "squat", label: "Squat" },
  { key: "deadlift", label: "Deadlift" },
];

export default function Estimated1RM({ logs }) {
  const mainLifts = useMemo(() => computeMainLift1RMs(logs), [logs]);

  const firstAvailable = OPTIONS.find((o) => mainLifts[o.key]);
  const [selected, setSelected] = useState(firstAvailable?.key || "bench");

  const data = mainLifts[selected];

  return (
    <div className="w-full h-full bg-brand-grey2 rounded-3xl p-4 flex flex-col justify-between items-start items-center">

      <div className="w-full flex flex-col gap-1">
        <h2 className="text-lg font-semibold whitespace-nowrap flex justify-center">
          Estimate 1RM
        </h2>

        <select
          className="bg-brand-grey3 text-xs rounded-full px-2 mx-auto py-1 outline-none"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          {OPTIONS.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {!data ? (
        <p className="text-sm text-brand-grey5 mt-2">
          No data for this lift yet.
        </p>
      ) : (
        <div className="w-full flex flex-col justify-between items-center">
          <p className="text-3xl font-semibold mb-2">
            {data.estimated1RM}
            <span className="text-base font-normal ml-1">kg</span>
          </p>
          <p className="text-xs text-brand-grey5">
            Best estimated 1RM
          </p>
        </div>
      )}
    </div>
  );
}
