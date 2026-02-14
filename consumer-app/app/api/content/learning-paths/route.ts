import { NextResponse } from "next/server";
import { learningPaths } from "@/data/content/learning-paths";

export async function GET() {
  return NextResponse.json(learningPaths);
}
