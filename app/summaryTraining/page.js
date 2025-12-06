import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import ExerciseLog from "@/models/exerciseLog";
import SummaryTrainingClient from "./summaryTrainingClient.js";

export default async function SummaryTrainingPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const id = resolvedParams?.id || null;

  if (!id) {
    return (
      <div className="w-full min-h-screen p-4 flex flex-col gap-4">
        <p className="text-sm text-brand-grey4">
          No workout selected. Go back to{" "}
          <Link href="/overviewTraining" className="text-brand-purple1 underline">
            Overview
          </Link>
          .
        </p>
      </div>
    );
  }

  await dbConnect();

  let log = null;
  try {
    log = await ExerciseLog.findById(id).lean();
  } catch (error) {
    console.error("Invalid ID format:", id);
  }

  if (!log) {
    return (
      <div className="w-full min-h-screen p-4 flex flex-col gap-4">
        <p className="text-sm text-brand-grey4">
          Workout not found. Go back to{" "}
          <Link href="/overviewTraining" className="text-brand-purple1 underline">
            Overview
          </Link>
          .
        </p>
      </div>
    );
  }

  const serializableLog = JSON.parse(JSON.stringify(log));

  return (
    <SummaryTrainingClient initialLog={serializableLog} />
  );
}
