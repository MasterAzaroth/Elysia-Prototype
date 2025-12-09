import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import UserProfile from "@/models/userProfile";

export async function PUT(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const {
      userId,
      age,
      gender,
      height,
      weight,
      nutritional_goal,
      nutritional_preference,
      activity_level,
      weekly_workout_frequency,
    } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Missing userId." },
        { status: 400 }
      );
    }

    const update = {
      age,
      gender,
      height,
      weight,
      nutritional_goal,
      nutritional_preference,
      activity_level,
    };

    if (weekly_workout_frequency !== undefined) {
      update.weekly_workout_frequency = weekly_workout_frequency;
    }

    const updatedUser = await UserProfile.findByIdAndUpdate(userId, update, {
      new: true,
    });

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, user: updatedUser },
      { status: 200 }
    );
  } catch (err) {
    console.error("Onboarding update error:", err);
    return NextResponse.json(
      { success: false, error: "Server error during onboarding." },
      { status: 500 }
    );
  }
}
