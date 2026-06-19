import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl
  const ADMIN_PHONE = process.env.ADMIN_PHONE;

  // Everything except /login is protected in the admin repo
  // if (pathname !== '/login' && !user) {
  //   const url = request.nextUrl.clone()
  //   url.pathname = '/login'
  //   return NextResponse.redirect(url)
  // }

  // Logged in but not admin → kick out
  if (user && user.phone !== ADMIN_PHONE) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('error', 'not_admin')
    return NextResponse.redirect(url)
  }

  // Already logged-in admin hitting /login → send to dashboard
  if (pathname === '/login' && user && user.phone !== ADMIN_PHONE) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|svg|webp)$).*)'],
}