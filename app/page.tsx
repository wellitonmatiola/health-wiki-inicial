import Link from 'next/link';
import { Leaf } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { DoencaResumo } from '@/lib/types';
import SearchBar from '@/components/SearchBar';

async function buscarDoencas(query: string): Promise<DoencaResumo[]> {
  const { data } = await supabase
    .from('doencas')
    .select('id, nome, cid10, status, descricao_medica')
    .eq('status', 'Publicado')
    .order('nome');
  return (data ?? []) as DoencaResumo[];
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q ?? '';
  const doencas = await buscarDoencas(query);

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--bg-card)]">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-forest-900 flex items-center justify-center">
              <Leaf size={16} className="text-white" />
            </div>
            <span className="text-xl font-semibold text-[var(--text)]">Health Wiki</span>
          </div>
          <Link href="/admin" className="text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
            Painel Admin →
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-10 text-center">
        <p className="text-sm text-[var(--muted)] tracking-widest uppercase mb-4 animate-fade-in">
          Enciclopédia Integrativa
        </p>
        <h1 className="text-5xl font-bold text-[var(--text)] leading-tight mb-4 animate-fade-up">
          O que você gostaria<br />
          <span className="text-[var(--muted)]">de compreender?</span>
        </h1>
        <p className="text-[var(--muted)] max-w-lg mx-auto mb-10 animate-fade-up delay-1">
          Explore a visão médica, metafísica e holística das doenças — com chás, cristais, chakras, aromaterapia e muito mais.
        </p>

        <SearchBar initialQuery={query} allDoencas={doencas} />
      </section>
    </main>
  );
}
