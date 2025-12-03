import mongoose from "mongoose";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Food from "@/models/food.js";
import FoodLog from "@/models/foodLog.js";

const DEMO_USER_ID = "demo-user";

export async function POST(req) {
  try {
    await dbConnect();

    console.log("🧠 Mongoose DB name:", mongoose.connection.name);
    console.log("🧠 Mongoose URI host:", mongoose.connection.host);

    const { foodId, grams, loggedAt } = await req.json();

    if (!foodId || !grams) {
      return NextResponse.json(
        { error: "foodId and grams are required" },
        { status: 400 }
      );
    }

    const food = await Food.findById(foodId);
    if (!food) {
      return NextResponse.json(
        { error: "Food not found" },
        { status: 404 }
      );
    }

    const ts = loggedAt ? new Date(loggedAt) : new Date();
    const factor = grams / 100;

    const calories = food.calories * factor;
    const protein = food.protein * factor;
    const carbs = food.carbs * factor;
    const fat = food.fat * factor;

    const log = await FoodLog.create({
      userId: DEMO_USER_ID,
      food: food._id,
      foodName: food.name,
      grams,
      calories,
      protein,
      carbs,
      fat,
      loggedAt: ts,
    });

    console.log("✅ Saved FoodLog:", log);

    return NextResponse.json(log, { status: 201 });
  } catch (err) {
    console.error("Error creating food log:", err);
    return NextResponse.json(
      { error: "Failed to create food log" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const day = searchParams.get("day");

    if (!day) {
      return NextResponse.json(
        { error: "day query param (YYYY-MM-DD) is required" },
        { status: 400 }
      );
    }

    const logs = await FoodLog.find({
      userId: DEMO_USER_ID,
      day,
    }).sort({ loggedAt: 1 });

    console.log("📦 GET /api/foodLog logs for day:", day, logs.length);

    return NextResponse.json(logs, { status: 200 });
  } catch (err) {
    console.error("Error fetching food logs:", err);
    return NextResponse.json(
      { error: "Failed to fetch food logs" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "id query param is required" },
        { status: 400 }
      );
    }

    await FoodLog.findOneAndDelete({
      _id: id,
      userId: DEMO_USER_ID,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Error deleting food log:", err);
    return NextResponse.json(
      { error: "Failed to delete food log" },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  try {
    await dbConnect();

    const { id, grams } = await req.json();

    if (!id || typeof grams !== "number" || grams < 0) {
      return NextResponse.json(
        { error: "id and positive numeric grams are required" },
        { status: 400 }
      );
    }

    const log = await FoodLog.findOne({
      _id: id,
      userId: DEMO_USER_ID,
    });

    if (!log) {
      return NextResponse.json(
        { error: "Food log not found" },
        { status: 404 }
      );
    }

    const food = await Food.findById(log.food);
    if (!food) {
      return NextResponse.json(
        { error: "Base food not found" },
        { status: 404 }
      );
    }

    const factor = grams / 100;

    log.grams = grams;
    log.calories = food.calories * factor;
    log.protein = food.protein * factor;
    log.carbs = food.carbs * factor;
    log.fat = food.fat * factor;

    const updated = await log.save();

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error("Error updating food log:", err);
    return NextResponse.json(
      { error: "Failed to update food log" },
      { status: 500 }
    );
  }
}