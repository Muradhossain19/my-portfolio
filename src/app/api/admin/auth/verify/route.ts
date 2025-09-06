import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

interface AdminJwtPayload {
  userId: number;
  email: string;
  name: string;
  iat?: number;
  exp?: number;
}

export async function GET(req: Request) {
  try {
    const token = req.headers
      .get("cookie")
      ?.split("admin-token=")[1]
      ?.split(";")[0];

    if (!token) {
      return NextResponse.json(
        { success: false, message: "No token found" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as AdminJwtPayload;

    return NextResponse.json({
      success: true,
      user: {
        id: decoded.userId,
        email: decoded.email,
        name: decoded.name,
      },
    });
  } catch (error) {
    console.error("[TOKEN_VERIFY_ERROR]", error);
    return NextResponse.json(
      { success: false, message: "Invalid token" },
      { status: 401 }
    );
  }
}
