import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const client = await pool.connect();
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const result = await client.query(
      "SELECT * FROM blog_posts WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      post: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blog post" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const client = await pool.connect();
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const data = await request.json();

    const result = await client.query(
      `UPDATE blog_posts SET 
       title = $1, slug = $2, excerpt = $3, content = $4, image = $5, 
       category = $6, author = $7, date = $8, read_time = $9, likes = $10, 
       tags = $11, featured = $12, meta_description = $13, published = $14,
       updated_at = CURRENT_TIMESTAMP
       WHERE id = $15
       RETURNING *`,
      [
        data.title,
        data.slug,
        data.excerpt,
        data.content,
        data.image,
        data.category,
        data.author,
        data.date,
        data.read_time,
        data.likes,
        data.tags,
        data.featured,
        data.meta_description,
        data.published,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      post: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update blog post" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const client = await pool.connect();

  try {
    const result = await client.query(
      "DELETE FROM blog_posts WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Blog post deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete blog post" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
