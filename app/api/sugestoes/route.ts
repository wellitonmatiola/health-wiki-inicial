import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { doenca_id, tipo, campo, conteudo, nome_autor, email_autor } = body;

    if (!doenca_id || !tipo || !conteudo) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 });
    }

    const db = supabaseAdmin();
    const { error } = await db.from('sugestoes').insert({
      doenca_id,
      tipo,
      campo:       campo || null,
      conteudo,
      nome_autor:  nome_autor || null,
      email_autor: email_autor || null,
    });

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro interno';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
