import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const TIPOS_VALIDOS = ['correcao', 'adicao', 'remocao', 'outro'];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { doenca_id, tipo, campo, conteudo, nome_autor, email_autor } = body;

    if (!doenca_id || !tipo || !conteudo) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 });
    }

    if (!UUID_RE.test(doenca_id)) {
      return NextResponse.json({ error: 'doenca_id inválido' }, { status: 400 });
    }

    if (!TIPOS_VALIDOS.includes(tipo)) {
      return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 });
    }

    if (typeof conteudo !== 'string' || conteudo.trim().length === 0 || conteudo.length > 5000) {
      return NextResponse.json({ error: 'Conteúdo inválido (máx. 5000 caracteres)' }, { status: 400 });
    }

    if (nome_autor && (typeof nome_autor !== 'string' || nome_autor.length > 100)) {
      return NextResponse.json({ error: 'Nome inválido (máx. 100 caracteres)' }, { status: 400 });
    }

    if (email_autor && (typeof email_autor !== 'string' || email_autor.length > 254)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }

    const db = supabaseAdmin();
    const { error } = await db.from('sugestoes').insert({
      doenca_id,
      tipo,
      campo:       campo || null,
      conteudo:    conteudo.trim(),
      nome_autor:  nome_autor?.trim() || null,
      email_autor: email_autor?.trim() || null,
    });

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
