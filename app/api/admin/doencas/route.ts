import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  if (cookieStore.get('admin_auth')?.value !== 'true') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { nome, cid10, descricao_medica, descricao_metafisica, fontes, status } = body;

    if (!nome?.trim()) {
      return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 });
    }

    const db = supabaseAdmin();
    const { data, error } = await db
      .from('doencas')
      .insert({ nome, cid10, descricao_medica, descricao_metafisica, fontes, status: status ?? 'Em coleta' })
      .select('id, nome, cid10, status, descricao_medica, descricao_metafisica, fontes, reiki')
      .single();

    if (error) throw error;
    return NextResponse.json({ ok: true, doenca: data });
  } catch {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
