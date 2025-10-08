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
      SELECT id, name, email, phone, subject, service, message, created_at
      FROM contacts_form 
      ORDER BY created_at DESC
    `);

    return NextResponse.json({
      success: true,
      contacts: result.rows,
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch contacts" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
