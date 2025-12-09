import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ExerciseLog from "@/models/exerciseLog";

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const body = await req.json();
    const { exercises, userId } = body;

    if (!userId) {
       return NextResponse.json({ error: "Missing userId" }, { status: 401 });
    }

    const sanitizedExercises = exercises.map((ex) => ({
      ...ex,
      sets: (ex.sets || []).map((set) => ({
        ...set,
        type: set.type || "Working Set",
        weight: Number(set.weight) || 0,
        reps: Number(set.reps) || 0,
      })),
    }));

    const updated = await ExerciseLog.findOneAndUpdate(
      { _id: id, userId }, 
      { exercises: sanitizedExercises },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Workout not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error("Server Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}