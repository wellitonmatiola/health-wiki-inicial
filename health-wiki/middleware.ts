import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protege /admin mas permite /admin/login e /api/admin/login
  const isAdminRoute = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login');
  const isAdminApi   = pathname.startsWith('/api/admin') && !pathname.startsWith('/api/admin/login');

  if (isAdminRoute || isAdminApi) {
    const autenticado = req.cookies.get('admin_auth')?.value === 'true';
    if (!autenticado) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
