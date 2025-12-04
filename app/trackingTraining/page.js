"use client";

import { useState } from "react";
import TrackingTrainingCard from "@/components/trackingTraining/tTC.js";

export default function TrackingTrainingPage() {
  const [workoutTitle, setWorkoutTitle] = useState("");

  return (
    <div className="w-full min-h-screen py-2 flex flex-col gap-6 items-center">

    <div className="w-full flex flex-col gap-1 px-2">

        <input
          type="text"
          value={workoutTitle}
          onChange={(e) => setWorkoutTitle(e.target.value)}
          placeholder="Workout Title"
          className="
            w-full
            bg-transparent
            text-3xl
            font-semibold
            text-white
            pb-2
            border-b-[3px]
            border-brand-grey4
            focus:outline-none
            focus:border-brand-purple1
            placeholder:text-brand-grey4
          "
        />

    </div>

    <div className="w-full border-b border-brand-grey3" />

      <TrackingTrainingCard
        title="Dumbbell Bicep Curls"
        muscle="Biceps"
      />
    </div>
  );
}
