import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

export async function POST(req: Request) {
  const { portfolio_id } = await req.json();
  const connection = await mysql.createConnection(dbConfig);
  await connection.query(
    "UPDATE portfolio_loves SET loves = loves + 1 WHERE portfolio_id = ?",
    [portfolio_id]
  );
  await connection.end();
  return NextResponse.json({ success: true });
}

export async function GET() {
  const connection = await mysql.createConnection(dbConfig);
  const [rows] = await connection.query("SELECT * FROM portfolio_loves");
  await connection.end();
  return NextResponse.json(rows);
}
