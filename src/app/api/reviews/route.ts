// File: src/app/api/reviews/route.ts

import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

// সব রিভিউ পাওয়ার জন্য
export async function GET(req: Request) {
  const client = await pool.connect();
  try {
    const { searchParams } = new URL(req.url);
    const project = searchParams.get("project"); // service/category/project name

    let rows;
    if (project) {
      const result = await client.query(
        "SELECT * FROM reviews WHERE project = $1 ORDER BY id DESC",
        [project]
      );
      rows = result.rows;
    } else {
      const result = await client.query(
        "SELECT * FROM reviews ORDER BY id DESC"
      );
      rows = result.rows;
    }
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

// নতুন রিভিউ যোগ করার জন্য
export async function POST(req: Request) {
  const client = await pool.connect();
  try {
    const data = await req.json();
    await client.query(
      `INSERT INTO reviews 
      (reviewer_name, reviewer_title, review_text, rating, company, project, image, date) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        data.name || data.reviewer_name,
        data.position || data.reviewer_title,
        data.testimonial || data.review_text,
        data.rating,
        data.company || "",
        data.project || "",
        data.image || "/images/hero-image.webp",
        data.date || "",
      ]
    );
    return NextResponse.json({
      success: true,
      message: "Review added successfully.",
    });
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

// একটি রিভিউ ডিলিট করার জন্য
export async function DELETE(req: Request) {
  const client = await pool.connect();
  try {
    const { id, token } = await req.json();

    // অ্যাডমিন টোকেন দিয়ে সুরক্ষা
    if (token !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!id) {
      return NextResponse.json(
        { error: "Review ID is required." },
        { status: 400 }
      );
    }

    await client.query("DELETE FROM reviews WHERE id = $1", [id]);
    return NextResponse.json({
      success: true,
      message: "Review deleted successfully.",
    });
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
