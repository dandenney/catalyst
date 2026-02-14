import { NextResponse } from "next/server";
import { assessments } from "@/data/content/assessments";

export async function GET() {
  return NextResponse.json(assessments);
}
