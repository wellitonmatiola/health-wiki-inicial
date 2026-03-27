import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';

const JUNCTION_MAP: Record<string, { table: string; fk: string }> = {
  chas:              { table: 'doencas_chas',              fk: 'cha_id' },
  causas_emocionais: { table: 'doencas_causas_emocionais', fk: 'causa_id' },
  chakras:           { table: 'doencas_chakras',           fk: 'chakra_id' },
  cristais:          { table: 'doencas_cristais',          fk: 'cristal_id' },
  aromaterapia:      { table: 'doencas_aromaterapia',      fk: 'aromaterapia_id' },
  cromoterapia:      { table: 'doencas_cromoterapia',      fk: 'cromoterapia_id' },
  perguntas:         { table: 'doencas_perguntas',         fk: 'pergunta_id' },
};

// PUT: substitui todas as relações de um tipo para uma doença
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const cookieStore = cookies();
  if (cookieStore.get('admin_auth')?.value !== 'true') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { tipo, ids, extras } = await req.json();
    const config = JUNCTION_MAP[tipo];
    if (!config) return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 });

    const db = supabaseAdmin();

    // Remove relações existentes
    await db.from(config.table).delete().eq('doenca_id', params.id);

    // Insere novas relações
    if (ids && ids.length > 0) {
      const rows = ids.map((relId: string, i: number) => ({
        doenca_id: params.id,
        [config.fk]: relId,
        ...(extras?.[i] ?? {}),
      }));
      const { error } = await db.from(config.table).insert(rows);
      if (error) throw error;
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro interno';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
