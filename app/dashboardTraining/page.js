"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DNav from "@/components/dashboard/dashboardNav.js";
import Estimated1RM from "@/components/dashboard/training/estimated1RM.js";
import StrongestLift from "@/components/dashboard/training/strongestLift.js";
import VolumeOverTime from "@/components/dashboard/training/volumeOverTime.js";
import MuscleDistribution from "@/components/dashboard/training/muscleDistribution.js";

export default function DashboardTrainingPage() {
  const router = useRouter();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const userId = localStorage.getItem("elysia_user_id");
    if (!userId) {
      router.push("/login");
      return;
    }

    async function fetchData() {
      try {
        const res = await fetch(`/api/exerciseLogs?userId=${userId}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setLogs(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-brand-grey1 flex items-center justify-center text-brand-grey5">
        Loading Training Data...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-brand-grey1 text-white">
      <DNav />
      <div className="w-full h-[1px] bg-brand-grey3 mt-6" />

      <main className="w-full mx-auto px-4 py-4">
        <div className="w-full flex justify-center">
          <h1 className="text-2xl font-semibold mt-2 mb-6">Training Dashboard</h1>
        </div>

        <div className="w-full h-auto flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-2">
            <div className="w-full md:w-1/2 aspect-square md:aspect-auto h-auto min-h-[250px]">
              <Estimated1RM logs={logs} />
            </div>
            <div className="w-full md:w-1/2 aspect-square md:aspect-auto h-auto min-h-[250px]">
              <StrongestLift logs={logs} />
            </div>
          </div>

          <div className="md:col-span-2">
            <VolumeOverTime logs={logs} />
          </div>

          <div className="md:col-span-2">
            <MuscleDistribution logs={logs} />
          </div>
        </div>
      </main>
    </div>
  );
}