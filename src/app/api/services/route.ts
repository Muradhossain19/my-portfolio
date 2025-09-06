// src/app/api/services/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// GET all services
export async function GET() {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT 
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
        created_at,
        updated_at
      FROM admin_services 
      ORDER BY created_at DESC
    `);
    return NextResponse.json({ success: true, services: result.rows });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch services" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// POST new service
export async function POST(request: NextRequest) {
  const client = await pool.connect();
  try {
    const body = await request.json();
    const insertQuery = `
      INSERT INTO admin_services (
        slug, title, subtitle, image, hero_description, overview,
        features, process, benefits, technologies, portfolio_examples,
        pricing, faqs, testimonials, why_choose, delivery_time, guarantee, is_active,
        created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7::jsonb, $8::jsonb, $9::jsonb, $10::jsonb, $11::jsonb,
        $12::jsonb, $13::jsonb, $14::jsonb, $15::jsonb, $16, $17, $18,
        NOW(), NOW()
      ) RETURNING 
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
    `;

    const values = [
      body.slug,
      body.title,
      body.subtitle,
      body.image,
      body.hero_description,
      body.overview,
      JSON.stringify(body.features || []),
      JSON.stringify(body.process || []),
      JSON.stringify(body.benefits || []),
      JSON.stringify(body.technologies || []),
      JSON.stringify(body.portfolio_examples || []),
      JSON.stringify(body.pricing || {}),
      JSON.stringify(body.faqs || []),
      JSON.stringify(body.testimonials || []),
      JSON.stringify(body.why_choose || []),
      body.delivery_time,
      body.guarantee,
      body.is_active ?? true,
    ];

    const result = await client.query(insertQuery, values);
    return NextResponse.json(
      { success: true, service: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create service" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
