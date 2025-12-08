"use client";

import { computeMacroAdherence } from "@/lib/nutritionAnalytics";

export default function MacroAdherenceCard({ logs, targets }) {
  const safeTargets = {
    protein: Number(targets?.protein) || 0,
    carbs: Number(targets?.carbs) || 0,
    fat: Number(targets?.fat) || 0,
  };

  const adherence = computeMacroAdherence(logs, safeTargets);

  return (
    <div className="w-full bg-brand-grey2 rounded-3xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Macro Adherence</h2>
        <span className="text-xs text-brand-grey5">Last 7 days</span>
      </div>

      <div className="flex flex-col items-center gap-1">
        <p className="text-xs text-brand-grey5">Overall score</p>
        <p className="text-3xl font-semibold leading-none">
          {adherence.score}
          <span className="text-base font-normal ml-1">%</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <MacroBar
          label="Protein"
          actual={adherence.protein.actual}
          target={safeTargets.protein}
          score={adherence.protein.score}
        />
        <MacroBar
          label="Carbs"
          actual={adherence.carbs.actual}
          target={safeTargets.carbs}
          score={adherence.carbs.score}
        />
        <MacroBar
          label="Fat"
          actual={adherence.fat.actual}
          target={safeTargets.fat}
          score={adherence.fat.score}
        />
      </div>
    </div>
  );
}

function MacroBar({ label, actual, target, score }) {
  const cappedScore = Math.max(0, Math.min(score || 0, 200));

  let barColor = "bg-brand-purple1";
  let textColor = "text-brand-grey5";

  if (cappedScore < 50) {
    barColor = "bg-red-500";
    textColor = "text-red-400";
  } else if (cappedScore < 90) {
    barColor = "bg-yellow-400";
    textColor = "text-yellow-400";
  } else if (cappedScore <= 110) {
    barColor = "bg-emerald-400";
    textColor = "text-emerald-400";
  } else {
    barColor = "bg-yellow-400";
    textColor = "text-yellow-400";
  }

  const barWidth = Math.min(cappedScore, 120);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className="font-medium text-sm">{label}</span>
        <span className="text-[11px] text-brand-grey5">
          {actual} / {target} g
        </span>
      </div>

      <div className="w-full h-2 rounded-full bg-brand-grey3 overflow-hidden">
        <div
          className={`h-full ${barColor}`}
          style={{ width: `${barWidth}%` }}
        />
      </div>

      <span className={`text-[11px] ${textColor}`}>{cappedScore}%</span>
    </div>
  );
}
