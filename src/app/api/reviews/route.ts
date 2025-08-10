import { NextResponse } from "next/server";

let reviews: any[] = [];

export async function GET() {
  return NextResponse.json(reviews);
}

export async function POST(req: Request) {
  const data = await req.json();
  reviews.push(data);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const { id, token } = await req.json();
  if (token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  reviews = reviews.filter((review) => review.id !== id);
  return NextResponse.json({ success: true });
}
