import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import UserProfile from "@/models/userProfile";
import jwt from "jsonwebtoken";

export async function POST(req) {
  const { email, password } = await req.json();

  await dbConnect();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const user = await UserProfile.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 400 });
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return NextResponse.json({ error: "Invalid password." }, { status: 400 });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

  return NextResponse.json({ success: true, token });
}
