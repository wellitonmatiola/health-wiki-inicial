import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const cookieStore = cookies();
  if (cookieStore.get('admin_auth')?.value !== 'true') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  if (!UUID_RE.test(params.id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { nome, cid10, descricao_medica, descricao_metafisica, fontes, fontes_medicas, fontes_metafisicas, fontes_complementares, status } = body;

    const db = supabaseAdmin();
    const { error } = await db
      .from('doencas')
      .update({ nome, cid10, descricao_medica, descricao_metafisica, fontes, fontes_medicas, fontes_metafisicas, fontes_complementares, status })
      .eq('id', params.id);

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const cookieStore = cookies();
  if (cookieStore.get('admin_auth')?.value !== 'true') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  if (!UUID_RE.test(params.id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  try {
    const db = supabaseAdmin();
    const { error } = await db.from('doencas').delete().eq('id', params.id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
