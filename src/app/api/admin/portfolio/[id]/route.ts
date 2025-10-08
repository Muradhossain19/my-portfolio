import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const client = await pool.connect();
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const result = await client.query(
      "SELECT * FROM portfolio_items WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Portfolio item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      portfolio: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching portfolio item:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch portfolio item" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const client = await pool.connect();
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const data = await request.json();

    const result = await client.query(
      `UPDATE portfolio_items SET 
       images = $1, category = $2, title = $3, description = $4, 
       long_description = $5, client = $6, date = $7, services = $8, 
       budget = $9, likes = $10, link = $11, features = $12, 
       updated_at = CURRENT_TIMESTAMP
       WHERE id = $13
       RETURNING *`,
      [
        data.images,
        data.category,
        data.title,
        data.description,
        data.long_description,
        data.client,
        data.date,
        data.services,
        data.budget,
        data.likes,
        data.link,
        data.features,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Portfolio item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      portfolio: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating portfolio item:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update portfolio item" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const client = await pool.connect();

  try {
    const result = await client.query(
      "DELETE FROM portfolio_items WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Portfolio item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Portfolio item deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting portfolio item:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete portfolio item" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
