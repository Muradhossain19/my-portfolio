// src/app/api/services/slug/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const client = await pool.connect();

  try {
    const slug = params.slug;

    const result = await client.query(
      `SELECT 
        id, slug, title, subtitle, image, hero_description, overview,
        features::text as features,
        process::text as process,
        benefits::text as benefits,
        technologies::text as technologies,
        portfolio_examples::text as portfolio_examples,
        pricing::text as pricing,
        faqs::text as faqs,
        testimonials::text as testimonials,
        why_choose::text as why_choose,
        delivery_time, guarantee, is_active,
        created_at, updated_at
      FROM admin_services 
      WHERE slug = $1 AND is_active = true`,
      [slug]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      service: result.rows[0],
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch service" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
