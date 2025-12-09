"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import OverviewNavbar from "@/components/global/overviewNavbar.js";
import SummaryCard from "@/components/trackingTraining/summaryCard.js";

const MUSCLE_PRIORITY = {
  Back: 1,
  Chest: 2,
  Legs: 3,
  Arms: 4,
  Shoulders: 5,
};

function categorizeMuscle(muscle) {
  if (!muscle) return null;
  const m = muscle.toLowerCase();
  if (m.includes("lat") || m.includes("back")) return "Back";
  if (m.includes("chest") || m.includes("pec")) return "Chest";
  if (m.includes("quad") || m.includes("hamstring") || m.includes("glute") || m.includes("calf") || m.includes("legs") || m.includes("leg")) return "Legs";
  if (m.includes("bicep") || m.includes("tricep") || m.includes("forearm") || m.includes("arm")) return "Arms";
  if (m.includes("delt") || m.includes("shoulder")) return "Shoulders";
  return null;
}

export default function OverviewTraining() {
  const router = useRouter();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const userId = localStorage.getItem("elysia_user_id");
    if (!userId) {
      router.push("/login");
      return;
    }

    async function fetchLogs() {
      try {
        const res = await fetch(`/api/exerciseLogs?userId=${userId}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setLogs(data);
        }
      } catch (err) {
        console.error("Failed to load logs:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchLogs();
  }, [router]);

  if (loading) {
    return <div className="p-8 text-center text-white">Loading workouts...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <OverviewNavbar />
      <div className="w-full h-[1px] bg-brand-grey3 my-6" />

      <div className="flex flex-col gap-3 px-2 pb-6">
        {logs.length === 0 && (
          <p className="text-sm text-brand-grey4 text-center">No workouts logged yet.</p>
        )}

        {logs.map((log) => {
          const title = log.workoutTitle || "Untitled Workout";
          const groupedMuscles = new Set();

          (log.exercises || []).forEach((ex) => {
            const category = categorizeMuscle(ex.muscle);
            if (category) groupedMuscles.add(category);
          });

          const sortedMuscles = Array.from(groupedMuscles).sort(
            (a, b) => (MUSCLE_PRIORITY[a] || 99) - (MUSCLE_PRIORITY[b] || 99)
          );

          const dateObj = log.date ? new Date(log.date) : new Date();
          const date = dateObj.toLocaleDateString("de-DE");

          const totalSetsNumber = (log.exercises || []).reduce(
            (acc, ex) => acc + ((ex.sets && ex.sets.length) || 0),
            0
          );
          const totalSets = `${totalSetsNumber} Sets`;

          return (
            <Link
              key={String(log._id)}
              href={`/summaryTraining?id=${log._id}`}
              className="block"
            >
              <SummaryCard
                title={title}
                muscles={sortedMuscles}
                date={date}
                totalSets={totalSets}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}