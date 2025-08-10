import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

export async function GET() {
  const connection = await mysql.createConnection(dbConfig);
  const [rows] = await connection.query(
    "SELECT * FROM reviews ORDER BY id DESC"
  );
  await connection.end();
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const data = await req.json();
  const connection = await mysql.createConnection(dbConfig);
  await connection.query(
    "INSERT INTO reviews (name, position, company, project, image, date, rating, testimonial) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      data.name,
      data.position,
      data.company,
      data.project,
      data.image,
      data.date,
      data.rating,
      data.testimonial,
    ]
  );
  await connection.end();
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const { id, token } = await req.json();
  if (token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const connection = await mysql.createConnection(dbConfig);
  await connection.query("DELETE FROM reviews WHERE id = ?", [id]);
  await connection.end();
  return NextResponse.json({ success: true });
}
