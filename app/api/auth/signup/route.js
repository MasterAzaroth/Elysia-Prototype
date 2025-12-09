import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import UserProfile from "@/models/userProfile";

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();

    const {
      email,
      password,
      user_name,
      gender,
      age,
      height,
      weight,
      nutritional_goal,
      activity_level,
    } = body;

    if (
      !email ||
      !password ||
      !user_name ||
      !gender ||
      !age ||
      !height ||
      !weight ||
      !nutritional_goal ||
      !activity_level
    ) {
      return NextResponse.json(
        { success: false, error: "All fields are required." },
        { status: 400 }
      );
    }

    const existing = await UserProfile.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "User already exists." },
        { status: 400 }
      );
    }

    const user = await UserProfile.create({
      email,
      password,
      user_name,
      gender,
      age,
      height,
      weight,
      nutritional_goal,
      activity_level,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully.",
        userId: user._id.toString(),
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { success: false, error: "Server error during signup." },
      { status: 500 }
    );
  }
}