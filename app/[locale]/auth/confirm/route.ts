import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type");
  const next = requestUrl.searchParams.get("next");
  const origin = requestUrl.origin;

  if (!tokenHash || !type || !next) {
    return NextResponse.redirect(`${origin}/sign-in?error=Invalid reset link`);
  }

  const supabase = await createClient();
  
  // Verify the token
  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: type as any,
  });

  if (error) {
    console.error("Token verification error:", error.message);
    return NextResponse.redirect(`${origin}/sign-in?error=${encodeURIComponent(error.message)}`);
  }

  // Redirect to the next URL (which should be /auth/callback)
  return NextResponse.redirect(`${origin}${next}`);
}