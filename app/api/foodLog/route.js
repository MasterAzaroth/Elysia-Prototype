import mongoose from "mongoose";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Food from "@/models/food.js";
import FoodLog from "@/models/foodLog.js";

export async function POST(req) {
  try {
    await dbConnect();
    
    const { userId, foodId, grams, loggedAt } = await req.json();

    if (!userId || !foodId || !grams) {
      return NextResponse.json(
        { error: "userId, foodId, and grams are required" },
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
      userId,
      food: food._id,
      foodName: food.name,
      grams,
      calories,
      protein,
      carbs,
      fat,
      loggedAt: ts,
    });

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
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const query = { userId };

    if (day) {
      query.day = day;
    }

    const logs = await FoodLog.find(query).sort({ loggedAt: 1 });

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
    const userId = searchParams.get("userId");

    if (!id || !userId) {
      return NextResponse.json(
        { error: "id and userId are required" },
        { status: 400 }
      );
    }

    const deleted = await FoodLog.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!deleted) {
      return NextResponse.json({ error: "Log not found or unauthorized" }, { status: 404 });
    }

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

    const { id, grams, userId } = await req.json();

    if (!id || typeof grams !== "number" || grams < 0 || !userId) {
      return NextResponse.json(
        { error: "id, userId, and positive grams are required" },
        { status: 400 }
      );
    }

    const log = await FoodLog.findOne({
      _id: id,
      userId,
    });

    if (!log) {
      return NextResponse.json(
        { error: "Food log not found or unauthorized" },
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