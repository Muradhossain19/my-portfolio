import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const client = await pool.connect();
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    await client.query("DELETE FROM contacts_form WHERE id = $1", [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting contact:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete contact" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
