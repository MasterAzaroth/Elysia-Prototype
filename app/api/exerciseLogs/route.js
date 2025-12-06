import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ExerciseLog from "@/models/exerciseLog";

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const { workoutTitle, date, exercises } = body;

    if (!Array.isArray(exercises) || exercises.length === 0) {
      return NextResponse.json(
        { error: "No exercises provided" },
        { status: 400 }
      );
    }

    const doc = await ExerciseLog.create({
      workoutTitle: workoutTitle || "Untitled Workout",
      date: date ? new Date(date) : new Date(),
      exercises: exercises.map((ex) => ({
        title: ex.title || "",
        muscle: ex.muscle || "",
        imageSrc: ex.imageSrc || "/Muscle/Upper%20Body/Chest.png",
        sets: (ex.sets || []).map((set) => ({
          type:
            set.type === "Warm-Up Set" || set.type === "Working Set"
              ? set.type
              : "Working Set",
          weight: set.weight ? Number(set.weight) : 0,
          reps: set.reps ? Number(set.reps) : 0,
        })),
      })),
    });

    return NextResponse.json(
      {
        ok: true,
        logId: doc._id,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Failed to save exercise log:", err);
    return NextResponse.json(
      { error: "Failed to save exercise log" },
      { status: 500 }
    );
  }
}