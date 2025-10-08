import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET() {
  const client = await pool.connect();
  try {
    // Get recent contacts (last 10)
    const recentContacts = await client.query(`
      SELECT 'contact' as type, name, email, created_at, 'New contact form submission from ' || name as message
      FROM contacts_form 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    // Get recent reviews (last 5)
    const recentReviews = await client.query(`
      SELECT 'review' as type, reviewer_name as name, rating, created_at, 
             'New ' || rating || '-star review from ' || reviewer_name as message
      FROM reviews 
      ORDER BY created_at DESC 
      LIMIT 3
    `);

    // Get recent subscriptions (last 5)
    const recentSubscriptions = await client.query(`
      SELECT 'subscription' as type, email as name, created_at, 
             'New newsletter subscription from ' || email as message
      FROM subscriptions_form 
      ORDER BY created_at DESC 
      LIMIT 3
    `);

    // Combine all activities
    const allActivities = [
      ...recentContacts.rows,
      ...recentReviews.rows,
      ...recentSubscriptions.rows,
    ];

    // Sort by date and limit to 10 most recent
    const sortedActivities = allActivities
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 10)
      .map((activity, index) => ({
        id: index + 1,
        type: activity.type,
        message: activity.message,
        timestamp: getTimeAgo(activity.created_at),
        created_at: activity.created_at,
      }));

    return NextResponse.json(sortedActivities);
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent activity" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// Helper function to calculate time ago
function getTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffInMs = now.getTime() - date.getTime();

  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else {
    return date.toLocaleDateString();
  }
}
