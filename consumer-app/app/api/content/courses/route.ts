import { NextResponse } from "next/server";
import { courses } from "@/data/content/courses";

export async function GET() {
  return NextResponse.json(courses);
}
