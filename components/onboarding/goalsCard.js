"use client";
import { Hamburger, Drumstick, Salad } from "lucide-react";

export default function GoalsCard({
  goal, setGoal,
  preference, setPreference,
  onContinue,
}) {
  const getButtonClass = (isActive) =>
    `flex-1 flex h-32 flex-col items-center justify-center rounded-2xl py-3 px-2 text-sm font-semibold uppercase transition-all duration-200 border-2 ${
      isActive
        ? "bg-brand-purple1 text-white border-brand-purple1 shadow-lg"
        : "bg-brand-grey3 text-brand-grey5 border-transparent hover:bg-white/5"
    }`;

  return (
    <div className="flex h-full w-full flex-col bg-brand-grey1 text-white">

      <div className="px-8 pt-8">
        <div className="flex h-[3px] w-full gap-1">
          <div className="h-full flex-1 rounded-full bg-brand-purple1" />
          <div className="h-full flex-1 rounded-full bg-brand-purple1" />
          <div className="h-full flex-1 rounded-full bg-brand-purple1" />
          <div className="h-full flex-1 rounded-full bg-brand-grey3" />
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center px-4 pt-8">
        <div className="mb-8 text-center">
          <p className="text-lg font-medium text-gray-300">
            Direction gives discipline meaning.
          </p>
        </div>

        <div className="w-full max-w-[360px] rounded-[32px] bg-white/5 p-6 backdrop-blur-sm">
          <p className="mb-4 text-center text-lg font-bold">Select your fitness goal</p>
          <div className="mb-8 flex w-full gap-3">
            <button type="button" onClick={() => setGoal("cut")} className={getButtonClass(goal === "cut")}>
              <Hamburger size={28} className="mb-2" /><span>Cut</span>
            </button>
            <button type="button" onClick={() => setGoal("maintain")} className={getButtonClass(goal === "maintain")}>
              <Drumstick size={28} className="mb-2" /><span>Maintain</span>
            </button>
            <button type="button" onClick={() => setGoal("bulk")} className={getButtonClass(goal === "bulk")}>
              <Salad size={28} className="mb-2" /><span>Bulk</span>
            </button>
          </div>

          <p className="mb-4 text-center text-lg font-bold">Select your nutritional preference</p>
          <div className="flex w-full gap-3">
            <button type="button" onClick={() => setPreference("high protein")} className={getButtonClass(preference === "high protein")}>
              <Hamburger size={28} className="mb-2" /><span className="text-center leading-tight">High<br />Protein</span>
            </button>
            <button type="button" onClick={() => setPreference("high carb")} className={getButtonClass(preference === "high carb")}>
              <Salad size={28} className="mb-2" /><span className="text-center leading-tight">High<br />Carbs</span>
            </button>
            <button type="button" onClick={() => setPreference("balanced")} className={getButtonClass(preference === "balanced")}>
              <Drumstick size={28} className="mb-2" /><span>Balanced</span>
            </button>
          </div>
        </div>
      </div>

      <div className="px-8 pb-12 pt-4">
        <button
          type="button"
          onClick={onContinue}
          className="mx-auto block w-full max-w-[360px] rounded-full bg-brand-purple1 py-4 text-sm font-bold uppercase tracking-wide text-white shadow-lg transition-transform active:scale-95"
        >
          Continue
        </button>
      </div>
    </div>
  );
}