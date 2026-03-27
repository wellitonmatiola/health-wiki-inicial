import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { senha } = await req.json();
  const senhaCorreta = process.env.ADMIN_PASSWORD ?? 'healthwiki2025';

  if (senha !== senhaCorreta) {
    return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set('admin_auth', 'true', {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 8, // 8 horas
    path: '/',
  });

  return res;
}
