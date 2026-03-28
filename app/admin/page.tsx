import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import type { Sugestao, DoencaResumo } from '@/lib/types';
import AdminShell from './AdminShell';

async function getData() {
  const db = supabaseAdmin();

  const [sugestoesRes, doencasRes, chasRes, chakrasRes, cristaisRes, aromRes, cromoRes, causasRes] = await Promise.all([
    db.from('sugestoes').select('*, doencas(nome)').order('criado_em', { ascending: false }),
    db.from('doencas').select('id, nome, cid10, status, descricao_medica, descricao_metafisica, fontes, fontes_medicas, fontes_metafisicas, fontes_complementares, reiki').order('nome'),
    db.from('chas').select('id, nome, nome_cientifico, tipo, beneficios_gerais, preparo, cuidados').order('nome'),
    db.from('chakras').select('id, nome, cor, sanscrito, bija_mantra, elemento_natureza').order('nome'),
    db.from('cristais').select('id, nome, beneficios_gerais, forma_aplicacao').order('nome'),
    db.from('aromaterapia').select('id, oleo, beneficios_gerais, via_diluicao').order('oleo'),
    db.from('cromoterapia').select('id, luz, proposta_acao, aplicacao').order('luz'),
    db.from('causas_emocionais').select('id, emocao, emocao_principal, descricao').order('emocao'),
  ]);

  return {
    sugestoes: (sugestoesRes.data ?? []) as Sugestao[],
    doencas: (doencasRes.data ?? []) as DoencaResumo[],
    complementos: {
      chas:              chasRes.data ?? [],
      chakras:           chakrasRes.data ?? [],
      cristais:          cristaisRes.data ?? [],
      aromaterapia:      aromRes.data ?? [],
      cromoterapia:      cromoRes.data ?? [],
      causas_emocionais: causasRes.data ?? [],
    },
  };
}

export default async function AdminPage() {
  const cookieStore = cookies();
  if (cookieStore.get('admin_auth')?.value !== 'true') redirect('/admin/login');
  const data = await getData();
  return <AdminShell {...data} />;
}
