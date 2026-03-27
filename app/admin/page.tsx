import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import type { Sugestao } from '@/lib/types';
import AdminClient from './AdminClient';

async function getSugestoes(): Promise<Sugestao[]> {
  const db = supabaseAdmin();
  const { data } = await db
    .from('sugestoes')
    .select('*, doencas(nome)')
    .order('criado_em', { ascending: false });
  return (data ?? []) as Sugestao[];
}

export default async function AdminPage() {
  // Verificação simples de acesso via cookie
  const cookieStore = cookies();
  const autenticado = cookieStore.get('admin_auth')?.value === 'true';

  if (!autenticado) redirect('/admin/login');

  const sugestoes = await getSugestoes();

  return <AdminClient sugestoes={sugestoes} />;
}
