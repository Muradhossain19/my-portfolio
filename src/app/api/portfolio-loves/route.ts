// File: src/app/api/portfolio-loves/route.ts

import { NextResponse } from "next/server";
import { Pool } from "pg";

// Neon ডাটাবেস কানেকশন পুল
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

// একটি নির্দিষ্ট পোর্টফোলিও আইটেমের জন্য love বাড়ানোর জন্য
export async function POST(req: Request) {
  const client = await pool.connect();
  try {
    const { portfolio_id } = await req.json();
    if (!portfolio_id) {
      return NextResponse.json(
        { success: false, message: "Portfolio ID is required." },
        { status: 400 }
      );
    }

    // প্রথমে চেক করুন পোর্টফোলিও আইডিটি টেবিলে আছে কিনা, না থাকলে নতুন রো তৈরি করুন
    await client.query(
      `INSERT INTO portfolio_loves (portfolio_id, loves_count)
       VALUES ($1, 1)
       ON CONFLICT (portfolio_id)
       DO UPDATE SET loves_count = portfolio_loves.loves_count + 1;`,
      [portfolio_id]
    );

    return NextResponse.json({ success: true, message: "Love count updated." });
  } catch (error: unknown) {
    console.error("[API_ERROR]", error);
    return NextResponse.json(
      { success: false, message: "An internal server error occurred." },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// সব পোর্টফোলিও আইটেমের love সংখ্যা পাওয়ার জন্য
export async function GET() {
  const client = await pool.connect();
  try {
    const { rows } = await client.query("SELECT * FROM portfolio_loves");
    return NextResponse.json(rows);
  } catch (error: unknown) {
    console.error("[API_ERROR]", error);
    return NextResponse.json(
      { success: false, message: "An internal server error occurred." },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
