import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/api";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  return NextResponse.json({
    anthropic_key_exists: !!process.env.ANTHROPIC_API_KEY,
    database_url_exists: !!process.env.DATABASE_URL,
    node_env: process.env.NODE_ENV,
  });
}
