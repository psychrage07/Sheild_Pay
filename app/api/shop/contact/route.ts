import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email?: unknown; message?: unknown };
    const email = String(body.email ?? "").trim().toLowerCase();
    const message = String(body.message ?? "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
    }
    if (message.length < 5 || message.length > 5000) {
      return NextResponse.json({ error: "Your message must be between 5 and 5,000 characters." }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Please try again." }, { status: 400 });
  }
}
