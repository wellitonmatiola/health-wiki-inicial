import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Leaf } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Doenca } from '@/lib/types';
import { COR_CHAKRA } from '@/lib/utils';
import SugestaoModal from '@/components/SugestaoModal';

async function getDoenca(id: string): Promise<Doenca | null> {
  const { data } = await supabase
    .from('vw_doencas_completa')
    .select('*')
    .eq('id', id)
    .single();
  return data as Doenca | null;
}

export default async function DoencaPage({ params }: { params: { id: string } }) {
  const doenca = await getDoenca(params.id);
  if (!doenca) notFound();

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--bg-card)] sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[var(--muted)] hover:text-[var(--accent)] transition-colors text-sm">
            <ArrowLeft size={16} />
            Voltar à busca
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-forest-500 flex items-center justify-center">
              <Leaf size={12} className="text-white" />
            </div>
            <span className="font-serif text-base font-semibold text-forest-700">Health Wiki</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Título */}
        <div className="mb-10 animate-fade-up">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            {doenca.cid10 && (
              <span className="badge bg-parchment-100 text-[var(--muted)]">
                CID-10: {doenca.cid10}
              </span>
            )}
            <span className={`badge ${doenca.status === 'Publicado' ? 'status-publicado' : doenca.status === 'Revisão' ? 'status-revisao' : 'status-em-coleta'}`}>
              {doenca.status}
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[var(--text)] leading-tight mb-6">
            {doenca.nome}
          </h1>

          <SugestaoModal doencaId={doenca.id} doencaNome={doenca.nome} />
        </div>

        {/* Descrição Médica */}
        {doenca.descricao_medica && (
          <section className="card p-7 mb-6 animate-fade-up delay-1">
            <h2 className="font-serif text-xl font-semibold mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-forest-500 inline-block" />
              Visão Médica
            </h2>
            <p className="text-[var(--muted)] leading-relaxed">{doenca.descricao_medica}</p>
          </section>
        )}

        {/* Descrição Metafísica */}
        {doenca.descricao_metafisica && (
          <section className="card p-7 mb-6 animate-fade-up delay-2" style={{ borderLeft: '3px solid var(--accent-2)' }}>
            <h2 className="font-serif text-xl font-semibold mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-terra-400 inline-block" />
              Causa Metafísica
            </h2>
            <p className="text-[var(--muted)] leading-relaxed italic">{doenca.descricao_metafisica}</p>
          </section>
        )}

        {/* Grid de complementos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

          {/* Causas Emocionais */}
          {doenca.causas_emocionais?.length > 0 && (
            <section className="card p-6 animate-fade-up delay-2">
              <h2 className="font-serif text-lg font-semibold mb-4">🥲 Causas Emocionais</h2>
              <div className="space-y-3">
                {doenca.causas_emocionais.map((c) => (
                  <div key={c.id} className="border-b border-[var(--border)] pb-3 last:border-0 last:pb-0">
                    <p className="font-medium text-sm">{c.emocao}</p>
                    {c.emocao_principal && (
                      <p className="text-xs text-[var(--muted)] mt-0.5">{c.emocao_principal}</p>
                    )}
                    {c.descricao && (
                      <p className="text-sm text-[var(--muted)] mt-1 leading-relaxed">{c.descricao}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Chakras */}
          {doenca.chakras?.length > 0 && (
            <section className="card p-6 animate-fade-up delay-2">
              <h2 className="font-serif text-lg font-semibold mb-4">🌈 Chakras Relacionados</h2>
              <div className="space-y-3">
                {doenca.chakras.map((ch) => (
                  <div key={ch.id} className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full shrink-0 ${COR_CHAKRA[ch.cor ?? ''] ?? 'bg-gray-400'}`} />
                    <div>
                      <p className="font-medium text-sm">{ch.nome}</p>
                      {ch.sanscrito && (
                        <p className="text-xs text-[var(--muted)] font-mono">{ch.sanscrito}</p>
                      )}
                      {ch.elemento && (
                        <p className="text-xs text-[var(--muted)]">Elemento: {ch.elemento}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Chás */}
          {doenca.chas?.length > 0 && (
            <section className="card p-6 animate-fade-up delay-3">
              <h2 className="font-serif text-lg font-semibold mb-4">🍵 Chás Indicados</h2>
              <div className="space-y-4">
                {doenca.chas.map((c) => (
                  <div key={c.id} className="border-b border-[var(--border)] pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm">{c.nome}</p>
                      {c.tipo?.map((t) => (
                        <span key={t} className="tag text-xs">{t}</span>
                      ))}
                    </div>
                    {c.nome_cientifico && (
                      <p className="text-xs text-[var(--muted)] italic mb-1">{c.nome_cientifico}</p>
                    )}
                    {c.beneficios && (
                      <p className="text-sm text-[var(--muted)] leading-relaxed">{c.beneficios}</p>
                    )}
                    {c.preparo && (
                      <details className="mt-2">
                        <summary className="text-xs text-forest-600 cursor-pointer font-medium">Ver preparo</summary>
                        <p className="text-sm text-[var(--muted)] mt-1 leading-relaxed">{c.preparo}</p>
                      </details>
                    )}
                    {c.cuidados && (
                      <p className="text-xs text-terra-500 mt-1">⚠ {c.cuidados}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Cristais */}
          {doenca.cristais?.length > 0 && (
            <section className="card p-6 animate-fade-up delay-3">
              <h2 className="font-serif text-lg font-semibold mb-4">💎 Cristais Indicados</h2>
              <div className="space-y-3">
                {doenca.cristais.map((c) => (
                  <div key={c.id} className="border-b border-[var(--border)] pb-3 last:border-0 last:pb-0">
                    <p className="font-medium text-sm mb-1">{c.nome}</p>
                    {c.beneficios && (
                      <p className="text-sm text-[var(--muted)] leading-relaxed">{c.beneficios}</p>
                    )}
                    {c.forma_aplicacao && (
                      <p className="text-xs text-forest-600 mt-1">Como usar: {c.forma_aplicacao}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Aromaterapia */}
          {doenca.aromaterapia?.length > 0 && (
            <section className="card p-6 animate-fade-up delay-4">
              <h2 className="font-serif text-lg font-semibold mb-4">🌺 Aromaterapia</h2>
              <div className="space-y-3">
                {doenca.aromaterapia.map((a) => (
                  <div key={a.id} className="border-b border-[var(--border)] pb-3 last:border-0 last:pb-0">
                    <p className="font-medium text-sm mb-1">{a.oleo}</p>
                    {a.beneficios && (
                      <p className="text-sm text-[var(--muted)] leading-relaxed">{a.beneficios}</p>
                    )}
                    {a.via_diluicao && (
                      <p className="text-xs text-forest-600 mt-1">Via: {a.via_diluicao}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Cromoterapia */}
          {doenca.cromoterapia?.length > 0 && (
            <section className="card p-6 animate-fade-up delay-4">
              <h2 className="font-serif text-lg font-semibold mb-4">💡 Cromoterapia</h2>
              <div className="space-y-3">
                {doenca.cromoterapia.map((c) => (
                  <div key={c.id} className="border-b border-[var(--border)] pb-3 last:border-0 last:pb-0">
                    <p className="font-medium text-sm mb-1">{c.luz}</p>
                    {c.proposta_acao && (
                      <p className="text-sm text-[var(--muted)] leading-relaxed">{c.proposta_acao}</p>
                    )}
                    {c.aplicacao && (
                      <p className="text-xs text-forest-600 mt-1">Aplicação: {c.aplicacao}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Perguntas reflexivas */}
        {doenca.perguntas?.length > 0 && (
          <section className="mt-8 animate-fade-up delay-5">
            <div className="divider mb-6">Perguntas para reflexão</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {doenca.perguntas.map((p) => (
                <div key={p.id} className="card p-4 border-l-2 border-l-forest-400">
                  <p className="text-sm text-[var(--muted)] italic leading-relaxed">{p.pergunta}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Fontes */}
        {doenca.fontes && (
          <section className="mt-10 pt-8 border-t border-[var(--border)] animate-fade-up delay-5">
            <h2 className="font-serif text-base font-semibold mb-3 text-[var(--muted)]">Fontes e Referências</h2>
            <p className="text-sm text-[var(--muted)] leading-relaxed">{doenca.fontes}</p>
          </section>
        )}
      </div>
    </main>
  );
}
