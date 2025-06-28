import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Blog from "@/models/Blog";

export async function GET() {
  try {
    await connectDB();
    const now = new Date();

    const nowUtc = new Date();
    const nowIst = new Date(nowUtc.getTime() + 5.5 * 60 * 60 * 1000); // +5:30 offset

    const result = await Blog.updateMany(
      { published: false, scheduledFor: { $lte: nowIst } },
      { $set: { published: true, updatedAt: nowUtc } }
    );


    return NextResponse.json({
      success: true,
      publishedCount: result.modifiedCount,
      message: `Published ${result.modifiedCount} scheduled blog(s).`,
    });
  } catch (error) {
    console.error("Error publishing scheduled blogs:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}