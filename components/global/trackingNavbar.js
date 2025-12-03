"use client";

import { useRouter, usePathname } from "next/navigation";
import { Hamburger, Dumbbell } from "lucide-react";

export default function DNav() {
  const router = useRouter();
  const pathname = usePathname();

  const baseClasses =
    "w-1/2 rounded-full p-3 flex justify-center cursor-pointer transition-colors";

  const isNutrition = pathname?.startsWith("/overviewNutrition");
  const isTraining = pathname?.startsWith("/overviewTraining");

  return (
    <div className="w-full h-auto bg-brand-grey2 rounded-full flex p-3 justify-between">
      <button
        onClick={() => router.push("/overviewNutrition")}
        className={`
          ${baseClasses} mr-2
          ${isNutrition ? "bg-brand-purple1" : ""}
        `}
      >
        <Hamburger />
        <p className="text-xl ml-2">Nutrition</p>
      </button>

      <button
        onClick={() => router.push("/overviewTraining")}
        className={`
          ${baseClasses} mx-2
          ${isTraining ? "bg-brand-purple1" : ""}
        `}
      >
        <Dumbbell />
        <p className="text-lg ml-2">Training</p>
      </button>
    </div>
  );
}
