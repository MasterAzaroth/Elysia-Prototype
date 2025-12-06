import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ExerciseLog from "@/models/exerciseLog";

export async function PUT(req, { params }) {
  console.log("------------------------------------------");
  console.log("🔥 PUT REQUEST RECEIVED AT /api/exerciseLog/[id]");
  
  try {

    const resolvedParams = await params;
    console.log("✅ Params resolved:", resolvedParams);
    
    const { id } = resolvedParams;
    console.log("✅ ID extracted:", id);

    if (!id) {
      console.log("❌ Error: No ID found in params");
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    let body;
    try {
      body = await req.json();
      console.log("✅ Body parsed, exercise count:", body.exercises?.length);
    } catch (e) {
      console.log("❌ Error parsing JSON body");
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    console.log("⏳ Connecting to DB...");
    await dbConnect();
    console.log("✅ DB Connected");

    console.log(`⏳ Attempting to update ID: ${id}`);
    
    const existing = await ExerciseLog.findById(id);
    console.log(existing ? "✅ Document FOUND in DB" : "❌ Document NOT FOUND in DB");

    if (!existing) {
       return NextResponse.json({ error: "Workout not found in DB" }, { status: 404 });
    }

    const { exercises } = body;
    const sanitizedExercises = exercises.map((ex) => ({
      ...ex,
      sets: (ex.sets || []).map((set) => ({
        ...set,
        type: set.type || "Working Set",
        weight: Number(set.weight) || 0,
        reps: Number(set.reps) || 0,
      })),
    }));

    const updated = await ExerciseLog.findByIdAndUpdate(
      id,
      { exercises: sanitizedExercises },
      { new: true }
    );

    console.log("✅ Update successful");
    console.log("------------------------------------------");
    
    return NextResponse.json(updated, { status: 200 });

  } catch (err) {
    console.error("❌ CRITICAL SERVER ERROR:", err);
    return NextResponse.json(
      { error: "Internal Server Error", details: err.message },
      { status: 500 }
    );
  }
}