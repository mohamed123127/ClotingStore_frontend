import { NextResponse } from "next/server";
 
let locales = ['en-US', 'nl-NL', 'nl']
 
// Get the preferred locale, similar to the above or using a library
function getLocale(request) { 
  function getLocale(request) {
    const acceptLang = request.headers.get("accept-language") || "";
    
    // يمر على اللغات المدعومة ويأخذ أول واحدة متوافقة
    const matched = locales.find(locale =>
      acceptLang.toLowerCase().includes(locale.toLowerCase())
    );
  
    // إذا لم يجد شيء يرجع الافتراضي
    return matched || "en";
  }
  
 }
 
export function middleware(request) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
 
  if (pathnameHasLocale) return
 
  // Redirect if there is no locale
  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  // e.g. incoming request is /products
  // The new URL is now /en-US/products
  return NextResponse.redirect(request.nextUrl)
}
 
export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next).*)',
    // Optional: only run on root (/) URL
    // '/'
  ],
}