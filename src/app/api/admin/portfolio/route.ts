import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET() {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT id, images, category, title, description, long_description, 
             client, date, services, budget, likes, link, features, 
             created_at, updated_at
      FROM portfolio_items 
      ORDER BY id ASC
    `);

    return NextResponse.json({
      success: true,
      portfolio: result.rows,
    });
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch portfolio" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export async function POST(request: Request) {
  const client = await pool.connect();
  try {
    const {
      images,
      category,
      title,
      description,
      long_description,
      client: clientName,
      date,
      services,
      budget,
      likes,
      link,
      features,
    } = await request.json();

    const result = await client.query(
      `INSERT INTO portfolio_items 
       (images, category, title, description, long_description, client, date, services, budget, likes, link, features)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [
        images,
        category,
        title,
        description,
        long_description,
        clientName,
        date,
        services,
        budget,
        likes,
        link,
        features,
      ]
    );

    return NextResponse.json({
      success: true,
      portfolio: result.rows[0],
      message: "Portfolio item created successfully",
    });
  } catch (error) {
    console.error("Error creating portfolio:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create portfolio" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
