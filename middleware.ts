import createMiddleware from 'next-intl/middleware';
import {type NextRequest} from 'next/server';
import {routing} from '@/i18n/routing';
import {updateSession} from '@/utils/supabase/middleware';
 
const handleI18nRouting = createMiddleware(routing);
 
export async function middleware(request: NextRequest) {
  const response = handleI18nRouting(request);
 
  // A `response` can now be passed here
  return await updateSession(request, response);
}
 
export const config = {
  // Match all paths except for:
  // - API routes (/api/*)
  // - Static files in /_next (/_next/*)
  // - Images, etc. in the root directory (/favicon.ico, /sitemap.xml, etc.)
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
