import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

// List of admin user IDs
const ADMIN_USER_IDS = [
  // Add your admin user IDs here
  '8db9eeb1-51bf-4daf-80b0-e204023232a9',
];

export const updateSession = async (request: NextRequest) => {
  // This `try/catch` block is only here for the interactive tutorial.
  // Feel free to remove once you have Supabase connected.
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    // Check admin routes access
    if (request.nextUrl.pathname.startsWith("/admin")) {
      if (userError || !user) {
        // Not logged in
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }
      
      // Check if user is in admin list
      if (!ADMIN_USER_IDS.includes(user.id)) {
        // Not an admin
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    // Redirect authenticated users away from auth pages
    if ((request.nextUrl.pathname === "/sign-in" || 
         request.nextUrl.pathname === "/sign-up") && 
        !userError) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return response;
  } catch (e) {
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    // Check out http://localhost:3000 for Next Steps.
    console.error('Middleware error:', e);
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
