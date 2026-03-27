'use client';

import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import type { Sugestao, StatusSugestao } from '@/lib/types';

const STATUS_LABEL: Record<StatusSugestao, string> = {
  pendente:  'Pendente',
  aprovada:  'Aprovada',
  rejeitada: 'Rejeitada',
};

const STATUS_CLASS: Record<StatusSugestao, string> = {
  pendente:  'status-em-coleta',
  aprovada:  'status-publicado',
  rejeitada: 'bg-red-50 text-red-700',
};

export default function SugestoesTab({ sugestoes: inicial }: { sugestoes: Sugestao[] }) {
  const [sugestoes, setSugestoes] = useState(inicial);
  const [filtro, setFiltro] = useState<StatusSugestao | 'todos'>('pendente');
  const [notas, setNotas] = useState<Record<string, string>>({});

  const filtradas = filtro === 'todos'
    ? sugestoes
    : sugestoes.filter((s) => s.status === filtro);

  const contadores = {
    pendente:  sugestoes.filter((s) => s.status === 'pendente').length,
    aprovada:  sugestoes.filter((s) => s.status === 'aprovada').length,
    rejeitada: sugestoes.filter((s) => s.status === 'rejeitada').length,
  };

  async function moderar(id: string, status: StatusSugestao) {
    const res = await fetch('/api/admin/sugestoes', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status, nota_admin: notas[id] ?? null }),
    });
    if (res.ok) {
      setSugestoes((prev) => prev.map((s) =>
        s.id === id ? { ...s, status, moderado_em: new Date().toISOString() } : s
      ));
    }
  }

  return (
    <div>
      {/* Contadores */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {([['pendente', '⏳'], ['aprovada', '✅'], ['rejeitada', '❌']] as const).map(([status, icon]) => (
          <button
            key={status}
            onClick={() => setFiltro(filtro === status ? 'todos' : status)}
            className={`card p-4 text-left transition-all ${filtro === status ? 'ring-2 ring-forest-500' : ''}`}
          >
            <p className="text-2xl mb-1">{icon}</p>
            <p className="text-2xl font-serif font-bold">{contadores[status]}</p>
            <p className="text-sm text-[var(--muted)]">{STATUS_LABEL[status]}{contadores[status] !== 1 ? 's' : ''}</p>
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="space-y-4">
        {filtradas.length === 0 && (
          <div className="card p-12 text-center text-[var(--muted)]">
            <p className="font-serif text-xl mb-1">Nenhuma sugestão</p>
            <p className="text-sm">Não há sugestões com este filtro.</p>
          </div>
        )}
        {filtradas.map((s) => (
          <div key={s.id} className="card p-6">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`badge ${STATUS_CLASS[s.status]}`}>{STATUS_LABEL[s.status]}</span>
                  <span className="badge bg-parchment-100 text-[var(--muted)]">{s.tipo}</span>
                  {s.campo && <span className="tag">{s.campo}</span>}
                </div>
                <p className="font-serif font-semibold text-lg">
                  {(s.doencas as { nome: string } | undefined)?.nome ?? '—'}
                </p>
                <p className="text-xs text-[var(--muted)] mt-0.5">
                  {new Date(s.criado_em).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                  {s.nome_autor && ` · ${s.nome_autor}`}
                  {s.email_autor && ` · ${s.email_autor}`}
                </p>
              </div>
              {s.status === 'pendente' && (
                <div className="flex gap-2">
                  <button onClick={() => moderar(s.id, 'aprovada')} className="btn-primary text-sm py-2 px-4">
                    <CheckCircle size={15} /> Aprovar
                  </button>
                  <button onClick={() => moderar(s.id, 'rejeitada')} className="btn-secondary text-sm py-2 px-4 border-red-300 text-red-600 hover:bg-red-50">
                    <XCircle size={15} /> Rejeitar
                  </button>
                </div>
              )}
            </div>
            <blockquote className="border-l-2 border-[var(--border)] pl-4 text-[var(--muted)] text-sm leading-relaxed mb-4">
              {s.conteudo}
            </blockquote>
            {s.status === 'pendente' && (
              <div>
                <label className="text-xs font-medium text-[var(--muted)] mb-1 block">Nota interna (opcional)</label>
                <textarea
                  className="textarea text-sm"
                  style={{ minHeight: '60px' }}
                  placeholder="Anotação para referência..."
                  value={notas[s.id] ?? ''}
                  onChange={(e) => setNotas({ ...notas, [s.id]: e.target.value })}
                />
              </div>
            )}
            {s.nota_admin && s.status !== 'pendente' && (
              <p className="text-xs text-[var(--muted)] mt-2 border-t border-[var(--border)] pt-2">Nota: {s.nota_admin}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
