import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Exercise from "@/models/exercise";

export async function GET() {
  try {
    await dbConnect();

    const exercises = await Exercise.find({}).sort({ Exercise: 1 }).lean();

    return NextResponse.json(exercises);
  } catch (err) {
    console.error("GET /api/exercises error:", err);
    return new NextResponse("Failed to fetch exercises", { status: 500 });
  }
}
