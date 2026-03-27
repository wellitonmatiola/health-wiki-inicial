import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';

export async function PATCH(req: NextRequest) {
  // Verifica autenticação admin
  const cookieStore = cookies();
  const autenticado = cookieStore.get('admin_auth')?.value === 'true';
  if (!autenticado) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { id, status, nota_admin } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 });
    }

    const db = supabaseAdmin();
    const { error } = await db
      .from('sugestoes')
      .update({
        status,
        nota_admin: nota_admin ?? null,
        moderado_em: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro interno';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
