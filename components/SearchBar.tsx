'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import Link from 'next/link';
import type { DoencaResumo } from '@/lib/types';

interface Props {
  initialQuery: string;
  allDoencas: DoencaResumo[];
}

/* Normaliza string: minúsculas + remove acentos + remove espaços duplos */
function normalizar(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacríticos
    .trim();
}

/* Verifica se query bate com nome, com tolerância a letras faltando ou erradas */
function match(nome: string, query: string): boolean {
  const n = normalizar(nome);
  const q = normalizar(query);
  if (!q) return true;

  // Correspondência direta (substring)
  if (n.includes(q)) return true;

  // Palavras: todas as palavras da query devem aparecer no nome
  const palavras = q.split(/\s+/).filter(Boolean);
  if (palavras.every((p) => n.includes(p))) return true;

  // Tolerância: permite 1 letra diferente ou faltando (Levenshtein simplificado por palavra)
  for (const palavra of palavras) {
    if (palavra.length < 3) continue;
    const palavrasNome = n.split(/\s+/);
    const temSimilar = palavrasNome.some((pn) => levenshtein(pn, palavra) <= 1);
    if (!temSimilar) return false;
  }
  return palavras.length > 0;
}

function levenshtein(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 2) return 99;
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

export default function SearchBar({ initialQuery, allDoencas }: Props) {
  const [query, setQuery] = useState(initialQuery);
  const [aberto, setAberto] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const resultados = useMemo(() => {
    if (!query.trim()) return allDoencas;
    return allDoencas.filter((d) => match(d.nome, query));
  }, [query, allDoencas]);

  const preview = useMemo(() => {
    if (!query.trim() || !aberto) return [];
    return resultados.slice(0, 6);
  }, [query, resultados, aberto]);

  // Fechar ao clicar fora
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setAberto(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') setAberto(false);
    if (e.key === 'Enter') {
      setAberto(false);
      router.push(query.trim() ? `/?q=${encodeURIComponent(query)}` : '/');
    }
  }

  const mostrarGrid = !aberto || !query.trim();

  return (
    <>
      {/* Barra de busca */}
      <div ref={containerRef} className="relative max-w-xl mx-auto animate-fade-up delay-2">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none z-10" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setAberto(true); }}
          onFocus={() => setAberto(true)}
          onKeyDown={handleKeyDown}
          placeholder="Buscar doença, sintoma..."
          className="input pl-11 pr-4 py-3.5 text-base shadow-sm w-full"
          autoComplete="off"
        />

        {/* Dropdown de preview */}
        {aberto && query.trim() && (
          <div className="absolute top-full mt-1.5 left-0 right-0 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-lg z-50 overflow-hidden">
            {preview.length === 0 ? (
              <p className="text-sm text-[var(--muted)] px-4 py-3">Nenhum resultado encontrado</p>
            ) : (
              <>
                {preview.map((d) => (
                  <Link
                    key={d.id}
                    href={`/doencas/${d.id}`}
                    onClick={() => setAberto(false)}
                    className="flex items-center justify-between px-4 py-3 hover:bg-parchment-50 border-b border-[var(--border)] last:border-0 transition-colors"
                  >
                    <div className="text-left">
                      <p className="text-sm font-medium text-[var(--text)]">{d.nome}</p>
                      {d.descricao_medica && (
                        <p className="text-xs text-[var(--muted)] line-clamp-1 mt-0.5">{d.descricao_medica}</p>
                      )}
                    </div>
                    {d.cid10 && (
                      <span className="badge bg-parchment-100 text-[var(--muted)] text-xs shrink-0 ml-3">
                        {d.cid10.split(',')[0].trim()}
                      </span>
                    )}
                  </Link>
                ))}
                {resultados.length > 6 && (
                  <button
                    onClick={() => { setAberto(false); router.push(`/?q=${encodeURIComponent(query)}`); }}
                    className="w-full text-center text-xs text-forest-600 font-medium px-4 py-2.5 hover:bg-parchment-50 transition-colors"
                  >
                    Ver todos os {resultados.length} resultados →
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Grid de resultados */}
      <section className="max-w-5xl mx-auto px-6 pb-20 mt-8">
        {query.trim() && (
          <div className="divider mb-8">
            {resultados.length} resultado{resultados.length !== 1 ? 's' : ''} para "{query}"
          </div>
        )}
        {!query.trim() && (
          <div className="divider mb-8">Todas as doenças</div>
        )}

        {resultados.length === 0 ? (
          <div className="text-center py-20 text-[var(--muted)]">
            <p className="font-serif text-2xl mb-2">Nenhum resultado encontrado</p>
            <p className="text-sm">Tente buscar por outro termo</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {resultados.map((d, i) => (
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
    </>
  );
}
