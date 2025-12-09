import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ExerciseLog from "@/models/exerciseLog";

export async function POST(req) {
  try {
    await dbConnect();

    const { userId, workoutTitle, date, exercises } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized: Missing userId" },
        { status: 401 }
      );
    }

    if (!Array.isArray(exercises) || exercises.length === 0) {
      return NextResponse.json(
        { error: "No exercises provided" },
        { status: 400 }
      );
    }

    const doc = await ExerciseLog.create({
      userId,
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
      { ok: true, logId: doc._id },
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

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const logs = await ExerciseLog.find({ userId }).sort({ date: -1 }).lean();

    return NextResponse.json(logs, { status: 200 });
  } catch (err) {
    console.error("Failed to fetch logs:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}