"use client";

import { useState } from "react";
import { Play } from "lucide-react"; 
import { computeMonthlyConsistencyCalendar } from "@/lib/consistencyAnalytics"; 

const weekdayLabels = ["M", "T", "W", "T", "F", "S", "S"];

export default function ConsistencyCalendar({
  exerciseLogs,
  foodLogs,
  targets,
}) {
  const now = new Date();
  const year = now.getFullYear();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());

  const { weeks } = computeMonthlyConsistencyCalendar(
    exerciseLogs,
    foodLogs,
    targets,
    year,
    currentMonth
  );

  const monthLabel = new Date(year, currentMonth).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const handleChangeMonth = (direction) => {
    setCurrentMonth((prevMonth) => prevMonth + direction);
  };

  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked((prev) => !prev);
  }

  return (

    <div className="w-full max-w-md mx-auto bg-brand-grey2 rounded-3xl p-4 flex flex-col gap-3">

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Consistency Calendar</h2>
        <span className="text-xs text-brand-grey5">{monthLabel}</span>
      </div>

      <div className="flex justify-between mt-2 px-1">
        <Play
          onClick={() => handleChangeMonth(-1)}
          className="text-xl cursor-pointer transform rotate-180 text-brand-grey5 hover:fill-current transition-colors"
        />
        <Play
          onClick={() => handleChangeMonth(1)}
          className="text-xl cursor-pointer text-brand-grey5 hover:fill-current transition-colors"
        />
      </div>

      <div className="mt-2 grid grid-cols-7 text-xs text-brand-grey5 place-items-center">
        {weekdayLabels.map((d, idx) => (
          <span key={d + idx}>
            {d}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-3 mt-1 place-items-center">
        {weeks.map((week, wIdx) =>
          week.map((cell, cIdx) => {
            if (!cell) {
              return (
                <div
                  key={`empty-${wIdx}-${cIdx}`}
                  className="w-6 h-6 rounded-[4px] bg-transparent"
                />
              );
            }

            const tooltipText = `${cell.date.toLocaleDateString("en-US")} \nTraining: ${!!cell.training} \nNutrition: ${!!cell.nutrition}`;

            return (
              <div
                key={cell.key || `cell-${wIdx}-${cIdx}`}
                className={squareClass(cell)}
                title={tooltipText} 
              />
            );
          })
        )}
      </div>

      <div className="mt-3 flex justify-end gap-3 items-center text-[10px] text-brand-grey5">
        <div className="flex items-center gap-1.5">
          <span className={squareClass({ training: false, nutrition: false })} />
          <span>none</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={squareClass({ training: true, nutrition: false })} />
          <span>one</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={squareClass({ training: true, nutrition: true })} />
          <span>both</span>
        </div>
      </div>
    </div>
  );
}

function squareClass(cell) {
  const base = "w-6 h-6 rounded-[4px] transition-colors duration-150";

  const hasTraining = Boolean(cell.training);
  const hasNutrition = Boolean(cell.nutrition);

  if (hasTraining && hasNutrition) {
    return base + " bg-brand-purple1"; 
  }

  if (hasTraining || hasNutrition) {
    return base + " bg-brand-purple1/40"; 
  }

  return base + " bg-brand-grey3"; 
}