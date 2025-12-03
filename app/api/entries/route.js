import dbConnect from "../../../lib/mongodb.js";
import Entry from "../../../models/entry.js";

export async function GET() {
  try {

    await dbConnect();

    const entries = await Entry.find({}).lean();

    return new Response(JSON.stringify(entries), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching entries:", error);
    return new Response(JSON.stringify({ message: "Error fetching entries" }), {
      status: 500,
    });
  }
}
