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
      SELECT id, title, slug, excerpt, content, image, category, author, 
             date, read_time, likes, tags, featured, meta_description, 
             published, created_at, updated_at
      FROM blog_posts 
      ORDER BY created_at DESC
    `);

    return NextResponse.json({
      success: true,
      posts: result.rows,
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export async function POST(request: Request) {
  const client = await pool.connect();
  try {
    const data = await request.json();

    const result = await client.query(
      `INSERT INTO blog_posts 
       (title, slug, excerpt, content, image, category, author, date, read_time, 
        likes, tags, featured, meta_description, published)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING *`,
      [
        data.title,
        data.slug,
        data.excerpt,
        data.content,
        data.image,
        data.imageAlt,
        data.category,
        data.author,
        data.date,
        data.read_time,
        data.likes || 0,
        data.tags || [],
        data.featured || false,
        data.meta_description,
        data.published || true,
      ]
    );

    return NextResponse.json({
      success: true,
      post: result.rows[0],
      message: "Blog post created successfully",
    });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create blog post" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
