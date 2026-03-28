import Link from 'next/link';
import { Search, Leaf } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { DoencaResumo } from '@/lib/types';

async function buscarDoencas(query: string): Promise<DoencaResumo[]> {
  if (query.trim().length < 2) {
    const { data } = await supabase
      .from('doencas')
      .select('id, nome, cid10, status, descricao_medica')
      .eq('status', 'Publicado')
      .order('nome')
      .limit(24);
    return (data ?? []) as DoencaResumo[];
  }

  const { data } = await supabase
    .from('doencas')
    .select('id, nome, cid10, status, descricao_medica')
    .eq('status', 'Publicado')
    .ilike('nome', `%${query}%`)
    .order('nome')
    .limit(24);

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

        {/* Barra de busca */}
        <form method="GET" action="/" className="relative max-w-xl mx-auto animate-fade-up delay-2">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]"
          />
          <input
            name="q"
            defaultValue={query}
            placeholder="Buscar doença, sintoma..."
            className="input pl-11 pr-4 py-3.5 text-base shadow-sm"
            autoComplete="off"
          />
        </form>
      </section>

      {/* Resultados */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        {query && (
          <div className="divider mb-8">
            {doencas.length} resultado{doencas.length !== 1 ? 's' : ''} para "{query}"
          </div>
        )}
        {!query && (
          <div className="divider mb-8">Todas as doenças</div>
        )}

        {doencas.length === 0 ? (
          <div className="text-center py-20 text-[var(--muted)]">
            <p className="font-serif text-2xl mb-2">Nenhum resultado encontrado</p>
            <p className="text-sm">Tente buscar por outro termo</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {doencas.map((d, i) => (
              <Link
                key={d.id}
                href={`/doencas/${d.id}`}
                className={`card p-5 block animate-fade-up delay-${Math.min(i + 1, 5)}`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h2 className="text-base font-semibold text-[var(--text)] leading-snug">
                    {d.nome}
                  </h2>
                  {d.cid10 && (
                    <span className="badge bg-forest-100 text-[var(--muted)] shrink-0 text-xs mt-0.5">
                      {d.cid10.split(',')[0].trim()}
                    </span>
                  )}
                </div>
                {d.descricao_medica && (
                  <p className="text-sm text-[var(--muted)] line-clamp-2 leading-relaxed">
                    {d.descricao_medica}
                  </p>
                )}
                <span className="inline-block mt-3 text-[var(--muted)] text-sm font-medium">
                  Ver detalhes →
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
