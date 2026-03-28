import { NextRequest, NextResponse } from 'next/server';

// Rate limiting simples em memória (por IP)
const tentativas = new Map<string, { count: number; resetAt: number }>();
const MAX_TENTATIVAS = 5;
const JANELA_MS = 15 * 60 * 1000; // 15 minutos

function verificarRateLimit(ip: string): boolean {
  const agora = Date.now();
  const registro = tentativas.get(ip);

  if (!registro || agora > registro.resetAt) {
    tentativas.set(ip, { count: 1, resetAt: agora + JANELA_MS });
    return true;
  }

  if (registro.count >= MAX_TENTATIVAS) {
    return false;
  }

  registro.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';

  if (!verificarRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Muitas tentativas. Aguarde 15 minutos.' },
      { status: 429 }
    );
  }

  const senhaCorreta = process.env.ADMIN_PASSWORD;
  if (!senhaCorreta) {
    console.error('ADMIN_PASSWORD não configurada');
    return NextResponse.json({ error: 'Erro de configuração do servidor' }, { status: 500 });
  }

  const { senha } = await req.json();

  if (senha !== senhaCorreta) {
    return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set('admin_auth', 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 2, // 2 horas
    path: '/',
  });

  return res;
}
