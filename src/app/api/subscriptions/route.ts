import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

export async function POST(req: Request) {
  const { email } = await req.json();
  const connection = await mysql.createConnection(dbConfig);
  await connection.query("INSERT INTO subscriptions (email) VALUES (?)", [
    email,
  ]);
  await connection.end();
  return NextResponse.json({ success: true });
}
