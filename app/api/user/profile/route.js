import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import UserProfile from "@/models/userProfile";

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Missing userId" },
        { status: 400 }
      );
    }

    const user = await UserProfile.findById(userId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user }, { status: 200 });

  } catch (err) {
    console.error("Fetch profile error:", err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}