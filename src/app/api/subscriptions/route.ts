// File: src/app/api/subscriptions/route.ts

import { NextResponse } from "next/server";
import { Pool } from "pg"; // mysql2 এর পরিবর্তে pg থেকে Pool ইম্পোর্ট করুন

// Neon ডাটাবেস কানেকশন পুল
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false, // সার্ভারলেস এনভায়রনমেন্টের জন্য এটি জরুরি
  },
});

export async function POST(req: Request) {
  const client = await pool.connect(); // কানেকশন পুল থেকে একটি ক্লায়েন্ট নিন
  try {
    const { email } = await req.json();

    // ইমেইল ভ্যালিডেশন (ঐচ্ছিক কিন্তু জরুরি)
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email address." },
        { status: 400 }
      );
    }

    // ডেটাবেস কোয়েরি Postgres সিনট্যাক্সে পরিবর্তন করা হয়েছে
    // আপনার টেবিলের নাম subscriptions_form, তাই সেটি ব্যবহার করছি
    await client.query(
      "INSERT INTO subscriptions_form (email) VALUES ($1) ON CONFLICT (email) DO NOTHING",
      [email]
    );

    return NextResponse.json({
      success: true,
      message: "Subscription successful!",
    });
  } catch (error: unknown) {
    // যদি অন্য কোনো কারণে এরর হয়
    console.error("[API_ERROR: SUBSCRIPTION]", error);
    return NextResponse.json(
      { success: false, message: "An internal server error occurred." },
      { status: 500 }
    );
  } finally {
    // কাজ শেষে ক্লায়েন্টটি পুলে ফেরত দিন
    client.release();
  }
}
