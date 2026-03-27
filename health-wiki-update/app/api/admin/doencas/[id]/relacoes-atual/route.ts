import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const cookieStore = cookies();
  if (cookieStore.get('admin_auth')?.value !== 'true') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const db = supabaseAdmin();
  const id = params.id;

  const [chasRes, chakrasRes, cristaisRes, aromRes, cromoRes, causasRes] = await Promise.all([
    db.from('doencas_chas')
      .select('cha_id, preparo, cuidados, dose, chas(id, nome, nome_cientifico, tipo)')
      .eq('doenca_id', id),
    db.from('doencas_chakras')
      .select('chakra_id, chakras(id, nome, cor, sanscrito)')
      .eq('doenca_id', id),
    db.from('doencas_cristais')
      .select('cristal_id, forma_aplicacao, cristais(id, nome)')
      .eq('doenca_id', id),
    db.from('doencas_aromaterapia')
      .select('aromaterapia_id, via_diluicao, modo_uso, aromaterapia(id, oleo)')
      .eq('doenca_id', id),
    db.from('doencas_cromoterapia')
      .select('cromoterapia_id, cromoterapia(id, luz)')
      .eq('doenca_id', id),
    db.from('doencas_causas_emocionais')
      .select('causa_id, causas_emocionais(id, emocao, emocao_principal)')
      .eq('doenca_id', id),
  ]);

  // Flatten: mescla dados da junção com dados do item relacionado
  const flatten = (rows: any[], fk: string, nested: string) =>
    (rows ?? []).map((r: any) => ({
      ...r[nested],
      ...Object.fromEntries(Object.entries(r).filter(([k]) => k !== nested)),
    }));

  return NextResponse.json({
    chas:              flatten(chasRes.data ?? [],    'cha_id',          'chas'),
    chakras:           flatten(chakrasRes.data ?? [], 'chakra_id',       'chakras'),
    cristais:          flatten(cristaisRes.data ?? [],'cristal_id',      'cristais'),
    aromaterapia:      flatten(aromRes.data ?? [],    'aromaterapia_id', 'aromaterapia'),
    cromoterapia:      flatten(cromoRes.data ?? [],   'cromoterapia_id', 'cromoterapia'),
    causas_emocionais: flatten(causasRes.data ?? [],  'causa_id',        'causas_emocionais'),
  });
}
