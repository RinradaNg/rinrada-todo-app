import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // ใช้ getUser() เพื่อความปลอดภัยสูงสุดในการเช็คฝั่ง Server
  const { data: { user } } = await supabase.auth.getUser()

  const isLoginPage = request.nextUrl.pathname.startsWith('/login')

  // กรณีที่ 1: ไม่มี User และไม่ได้อยู่ที่หน้า Login -> ให้ไปหน้า Login
  if (!user && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // กรณีที่ 2: มี User แล้วแต่พยายามจะเข้าหน้า Login -> ให้ไปหน้าหลัก
  if (user && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * ดักจับทุก Path ยกเว้น:
     * - api (เดี๋ยวจะติดเรื่องการเรียกใช้งาน API)
     * - _next/static (ไฟล์ static ของ Next.js)
     * - _next/image (ระบบจัดการรูปภาพ)
     * - favicon.ico, public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
}