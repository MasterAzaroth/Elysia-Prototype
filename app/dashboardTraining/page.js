import DNav from "@/components/dashboard/dashboardNav.js";
import Estimated1RM from "@/components/dashboard/training/estimated1RM.js";
import StrongestLift from "@/components/dashboard/training/strongestLift.js";
import VolumeOverTime from "@/components/dashboard/training/volumeOverTime.js";
import MuscleDistribution from "@/components/dashboard/training/muscleDistribution.js";

import dbConnect from "@/lib/mongodb";
import ExerciseLog from "@/models/exerciseLog";

export default async function DashboardTrainingPage() {
  await dbConnect();

  const logs = await ExerciseLog.find({}).sort({ date: 1 }).lean();
  const plainLogs = JSON.parse(JSON.stringify(logs));

  return (
    <div className="min-h-screen w-full bg-brand-grey1 text-white">
      <DNav />
      <div className="w-full h-[1px] bg-brand-grey3 mt-6" />

      <main className="w-full mx-auto px-4 py-4">

        <div className="w-full flex justify-center">
            <h1 className="text-2xl font-semibold mt-2 mb-6">Training Dashboard</h1>
        </div>

        <div className="w-full h-auto flex flex-col gap-4">
          
          <div className="flex gap-2">

            <div className="w-full md:w-1/2 md:aspect-square">
                <Estimated1RM logs={plainLogs} />
            </div>

            <div className="w-full md:w-1/2 md:aspect-square">
                <StrongestLift logs={plainLogs} />
            </div>
          </div>

          <div className="md:col-span-2">
            <VolumeOverTime logs={plainLogs} />
          </div>

          <div className="md:col-span-2">
            <MuscleDistribution logs={plainLogs} />
          </div>
        </div>
      </main>
    </div>
  );
}
