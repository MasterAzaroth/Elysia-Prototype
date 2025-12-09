"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import WelcomeCard from "@/components/onboarding/welcomeCard";
import PhysiologyCard from "@/components/onboarding/physiologyCard";
import GoalsCard from "@/components/onboarding/goalsCard";
import CurrentRhythmCard from "@/components/onboarding/currentRythmCard";

export default function OnboardingPage() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [step, setStep] = useState(0);

  const [age, setAge] = useState(21);
  const [gender, setGender] = useState("male");
  const [height, setHeight] = useState(187);
  const [weight, setWeight] = useState(88.5);

  const [goal, setGoal] = useState("maintain");
  const [preference, setPreference] = useState("high protein");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = localStorage.getItem("elysia_user_id");
    if (!id) {
      router.push("/signup");
    } else {
      setUserId(id);
    }
  }, [router]);

  function handleNextStep() {
    setStep((prev) => prev + 1);
  }

  async function handleFinish(rhythmData) {
    if (!userId) return;

    const { workoutFreq, isNoWorkout, activityLevel } = rhythmData;

    try {
      const res = await fetch("/api/auth/onboarding", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          age,
          gender,
          height,
          weight,
          nutritional_goal: goal,
          nutritional_preference: preference,
          activity_level: activityLevel,

          weekly_workout_frequency: isNoWorkout ? 0 : workoutFreq,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        console.error("Onboarding error:", data.error);
        return;
      }

      router.push("/overviewTraining"); 
    } catch (err) {
      console.error("Onboarding error:", err);
    }
  }

  return (
    <div className="h-screen w-full bg-brand-grey1">
      {step === 0 && (
        <WelcomeCard onContinue={handleNextStep} />
      )}
      
      {step === 1 && (
        <PhysiologyCard
          age={age}
          setAge={setAge}
          gender={gender}
          setGender={setGender}
          height={height}
          setHeight={setHeight}
          weight={weight}
          setWeight={setWeight}
          onContinue={handleNextStep}
        />
      )}

      {step === 2 && (
        <GoalsCard
          goal={goal}
          setGoal={setGoal}
          preference={preference}
          setPreference={setPreference}
          onContinue={handleNextStep}
        />
      )}

      {step === 3 && (
        <CurrentRhythmCard 
           onContinue={handleFinish} 
        />
      )}
    </div>
  );
}