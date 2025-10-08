import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET() {
  const client = await pool.connect();
  try {
    console.log("Dashboard stats API called");

    // Try to fetch each table individually with error handling
    let totalContacts = 0;
    let totalReviews = 0;
    let totalSubscribers = 0;
    let totalPortfolios = 0; // Add this

    try {
      const contactsResult = await client.query(
        "SELECT COUNT(*) FROM contacts_form"
      );
      totalContacts = Number(contactsResult.rows[0].count);
    } catch (error) {
      console.log("Error fetching contacts:", error);
    }

    try {
      const reviewsResult = await client.query("SELECT COUNT(*) FROM reviews");
      totalReviews = Number(reviewsResult.rows[0].count);
    } catch (error) {
      console.log("Error fetching reviews:", error);
    }

    try {
      const subscribersResult = await client.query(
        "SELECT COUNT(*) FROM subscriptions_form"
      );
      totalSubscribers = Number(subscribersResult.rows[0].count);
    } catch (error) {
      console.log("Error fetching subscribers:", error);
    }

    try {
      const portfoliosResult = await client.query(
        "SELECT COUNT(*) FROM portfolio_items"
      );
      totalPortfolios = Number(portfoliosResult.rows[0].count);
    } catch (error) {
      console.log("Error fetching portfolios:", error);
      totalPortfolios = 0;
    }

    const result = {
      totalContacts,
      totalReviews,
      totalSubscribers,
      totalPortfolios, // <-- use this
    };

    console.log("Dashboard stats result:", result);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
