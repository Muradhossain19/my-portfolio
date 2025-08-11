// File: src/app/api/blog-likes/route.ts

import { NextResponse } from "next/server";
import { Pool } from "pg";

// Neon ডাটাবেস কানেকশন পুল
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

// একটি নির্দিষ্ট ব্লগের লাইক বাড়ানোর জন্য
export async function POST(req: Request) {
  const client = await pool.connect();
  try {
    const { blog_id } = await req.json();
    if (!blog_id) {
      return NextResponse.json(
        { success: false, message: "Blog ID is required." },
        { status: 400 }
      );
    }

    // প্রথমে চেক করুন ব্লগ আইডিটি টেবিলে আছে কিনা, না থাকলে নতুন রো তৈরি করুন
    await client.query(
      `INSERT INTO blog_likes (blog_id, likes_count)
       VALUES ($1, 1)
       ON CONFLICT (blog_id)
       DO UPDATE SET likes_count = blog_likes.likes_count + 1;`,
      [blog_id]
    );

    return NextResponse.json({ success: true, message: "Like count updated." });
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

// সব ব্লগের লাইক সংখ্যা পাওয়ার জন্য
export async function GET() {
  const client = await pool.connect();
  try {
    const { rows } = await client.query("SELECT * FROM blog_likes");
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
