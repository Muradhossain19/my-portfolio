// src/app/api/services/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = await pool.connect();

  try {
    const serviceId = params.id;

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
      WHERE id = $1`,
      [serviceId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Service not found" },
        { status: 404 }
      );
    }
    console.log("DB থেকে আসা updated_at:", result.rows[0].updated_at);
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // API route hit হচ্ছে কিনা check করার জন্য
  console.log("🔥 PUT API CALLED - Service ID:", params.id);
  console.log("🔥 Request received at:", new Date().toISOString());

  const client = await pool.connect();

  try {
    const serviceId = params.id;
    const body = await request.json();

    console.log("📝 Request body received:", Object.keys(body));
    console.log("🕐 Server time:", new Date().toString());

    const {
      title,
      subtitle,
      slug,
      image,
      hero_description,
      overview,
      features,
      process,
      benefits,
      technologies,
      portfolio_examples,
      pricing,
      faqs,
      testimonials,
      why_choose,
      delivery_time,
      guarantee,
      is_active,
    } = body;

    const result = await client.query(
      `UPDATE admin_services SET 
        title = $1, subtitle = $2, slug = $3, image = $4,
        hero_description = $5, overview = $6,
        features = $7::jsonb, process = $8::jsonb, benefits = $9::jsonb,
        technologies = $10::jsonb, portfolio_examples = $11::jsonb,
        pricing = $12::jsonb, faqs = $13::jsonb, testimonials = $14::jsonb,
        why_choose = $15::jsonb, delivery_time = $16, guarantee = $17,
        is_active = $18, updated_at = NOW()
      WHERE id = $19
      RETURNING 
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
        created_at, updated_at`,
      [
        title,
        subtitle,
        slug,
        image,
        hero_description,
        overview,
        JSON.stringify(features),
        JSON.stringify(process),
        JSON.stringify(benefits),
        JSON.stringify(technologies),
        JSON.stringify(portfolio_examples),
        JSON.stringify(pricing),
        JSON.stringify(faqs),
        JSON.stringify(testimonials),
        JSON.stringify(why_choose),
        delivery_time,
        guarantee,
        is_active,
        serviceId,
      ]
    );

    console.log("✅ Database update successful");
    console.log("📅 Updated timestamp:", result.rows[0]?.updated_at);

    if (result.rows.length === 0) {
      console.log("❌ Service not found with ID:", serviceId);
      return NextResponse.json(
        { success: false, error: "Service not found" },
        { status: 404 }
      );
    }

    console.log("🚀 Returning success response");
    return NextResponse.json({
      success: true,
      service: result.rows[0],
    });
  } catch (error) {
    console.error("💥 Database error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update service" },
      { status: 500 }
    );
  } finally {
    client.release();
    console.log("🔌 Database connection released");
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = await pool.connect();

  try {
    const serviceId = params.id;

    const result = await client.query(
      "DELETE FROM admin_services WHERE id = $1 RETURNING id",
      [serviceId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete service" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
