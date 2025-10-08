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
      SELECT id, name, email, phone, subject, message, price, created_at
      FROM orders_contact_form 
      ORDER BY created_at DESC
    `);

    return NextResponse.json({
      success: true,
      orders: result.rows,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
