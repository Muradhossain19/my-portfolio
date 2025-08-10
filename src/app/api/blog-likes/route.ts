import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

export async function POST(req: Request) {
  const { blog_id } = await req.json();
  const connection = await mysql.createConnection(dbConfig);
  await connection.query(
    "UPDATE blog_likes SET likes = likes + 1 WHERE blog_id = ?",
    [blog_id]
  );
  await connection.end();
  return NextResponse.json({ success: true });
}

export async function GET() {
  const connection = await mysql.createConnection(dbConfig);
  const [rows] = await connection.query("SELECT * FROM blog_likes");
  await connection.end();
  return NextResponse.json(rows);
}
