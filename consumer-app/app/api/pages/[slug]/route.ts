import { JsonStorageAdapter } from "catalyst/server";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

const storage = new JsonStorageAdapter({
  dataDir: path.join(process.cwd(), "data"),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const page = await storage.getPage(slug);

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error("Error fetching page:", error);
    return NextResponse.json(
      { error: "Failed to fetch page" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const page = await request.json();

    // Ensure the slug matches
    if (page.slug !== slug) {
      return NextResponse.json(
        { error: "Slug mismatch" },
        { status: 400 }
      );
    }

    await storage.savePage(page);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving page:", error);
    return NextResponse.json(
      { error: "Failed to save page" },
      { status: 500 }
    );
  }
}
