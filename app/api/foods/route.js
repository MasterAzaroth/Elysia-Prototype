import dbConnect from "../../../lib/mongodb.js";
import Food from "../../../models/food.js";

export async function GET() {
  try {

    await dbConnect();

    const foods = await Food.find({}).lean();

    return new Response(JSON.stringify(foods), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching foods:", error);
    return new Response(
      JSON.stringify({ message: "Error fetching foods" }),
      { status: 500 }
    );
  }
}
