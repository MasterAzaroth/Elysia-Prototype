"use client";

import { useState } from "react";
import { Info } from "lucide-react";

export default function CurrentRhythmCard({ onContinue }) {
  const [workoutFreq, setWorkoutFreq] = useState(4);
  const [isNoWorkout, setIsNoWorkout] = useState(false);
  const [activityLevel, setActivityLevel] = useState(3);

  const getSliderStyle = (value, min, max, isDisabled) => {
    const percentage = ((value - min) / (max - min)) * 100;
    const activeColor = isDisabled ? "#4b5563" : "#8B5CF6";
    const trackColor = "#374151";
    return {
      background: `linear-gradient(to right, ${activeColor} 0%, ${activeColor} ${percentage}%, ${trackColor} ${percentage}%, ${trackColor} 100%)`,
    };
  };

  return (
    <div className="flex h-full w-full flex-col bg-brand-grey1 text-white">

      <div className="px-8 pt-8">
        <div className="flex h-[3px] w-full gap-1">
          <div className="h-full flex-1 rounded-full bg-brand-purple1" />
          <div className="h-full flex-1 rounded-full bg-brand-purple1" />
          <div className="h-full flex-1 rounded-full bg-brand-purple1" />
          <div className="h-full flex-1 rounded-full bg-brand-purple1" />
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center px-4 pt-8">
        <div className="mb-8 text-center">
          <p className="text-lg font-medium text-gray-300">
            Your habits build your foundation.
          </p>
        </div>

        <div className="w-full max-w-[360px] rounded-[32px] bg-white/5 p-6 backdrop-blur-sm">
          <p className="mb-8 text-center text-xl font-bold">
            Reflect on your current rhythm.
          </p>

          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between text-sm font-medium text-gray-400">
              <span>Weekly Workout Frequency</span>
              {!isNoWorkout && (
                <span className="font-bold text-brand-purple1">{workoutFreq} / 7</span>
              )}
            </div>
            <div className="relative mb-6">
              <input
                type="range" min="1" max="7" step="1"
                disabled={isNoWorkout}
                value={workoutFreq}
                onChange={(e) => setWorkoutFreq(Number(e.target.value))}
                style={getSliderStyle(workoutFreq, 1, 7, isNoWorkout)}
                className={`h-1.5 w-full appearance-none rounded-full outline-none transition-all duration-200 ${
                  isNoWorkout ? "cursor-not-allowed opacity-30" : "cursor-pointer"
                } [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#8B5CF6] [&::-webkit-slider-thumb]:shadow-lg`}
              />
              <div className={`mt-2 flex justify-between px-1 ${isNoWorkout ? "opacity-30" : ""}`}>
                {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                  <div key={num} className="flex flex-col items-center gap-1">
                    <div className="h-1 w-px bg-gray-600"></div>
                    <span className={`text-[10px] font-bold ${workoutFreq === num ? "text-white" : "text-gray-500"}`}>{num}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <input
                type="checkbox" id="no-workout"
                checked={isNoWorkout}
                onChange={(e) => setIsNoWorkout(e.target.checked)}
                className="h-5 w-5 cursor-pointer rounded border-gray-600 bg-transparent text-[#8B5CF6] focus:ring-0 focus:ring-offset-0"
              />
              <label htmlFor="no-workout" className="cursor-pointer select-none text-sm text-gray-300">
                I currently don't workout
              </label>
            </div>
          </div>

          <div className="mb-4">
            <div className="mb-4 flex items-center justify-between text-sm font-medium text-gray-400">
              <div className="flex items-center gap-2">
                Activity Level
              </div>
              <span className="font-bold text-brand-purple1">{activityLevel} / 5</span>
            </div>
            <div className="relative">
              <input
                type="range" min="1" max="5" step="1"
                value={activityLevel}
                onChange={(e) => setActivityLevel(Number(e.target.value))}
                style={getSliderStyle(activityLevel, 1, 5, false)}
                className="h-1.5 w-full appearance-none rounded-full cursor-pointer outline-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#8B5CF6] [&::-webkit-slider-thumb]:shadow-lg"
              />
              <div className="mt-2 flex justify-between px-1">
                {[1, 2, 3, 4, 5].map((num) => (
                  <div key={num} className="flex flex-col items-center gap-1">
                    <div className="h-1 w-px bg-gray-600"></div>
                    <span className={`text-[10px] font-bold ${activityLevel === num ? "text-white" : "text-gray-500"}`}>{num}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 pb-12 pt-4">
        <button
          type="button"
          onClick={() => onContinue({ workoutFreq, isNoWorkout, activityLevel })}
          className="mx-auto block w-full max-w-[360px] rounded-full bg-brand-purple1 py-4 text-sm font-bold uppercase tracking-wide text-white shadow-lg transition-transform active:scale-95"
        >
          Continue
        </button>
      </div>
    </div>
  );
}