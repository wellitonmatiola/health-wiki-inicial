'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Leaf, ArrowLeft, Stethoscope, MessageSquare } from 'lucide-react';
import type { Sugestao, DoencaResumo, StatusSugestao } from '@/lib/types';
import SugestoesTab from './SugestoesTab';
import DoencasTab from './DoencasTab';

interface Props {
  sugestoes: Sugestao[];
  doencas: DoencaResumo[];
  complementos: Record<string, any[]>;
}

export default function AdminShell({ sugestoes, doencas, complementos }: Props) {
  const [tab, setTab] = useState<'doencas' | 'sugestoes'>('doencas');
  const pendentes = sugestoes.filter((s) => s.status === ('pendente' as StatusSugestao)).length;

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--bg-card)] sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-[var(--muted)] hover:text-[var(--accent)] transition-colors text-sm">
              <ArrowLeft size={16} /> Site público
            </Link>
            <div className="w-px h-5 bg-[var(--border)]" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-forest-500 flex items-center justify-center">
                <Leaf size={12} className="text-white" />
              </div>
              <span className="font-serif font-semibold text-forest-700">Painel Admin</span>
            </div>
          </div>
          <form action="/api/admin/logout" method="POST">
            <button className="text-sm text-[var(--muted)] hover:text-red-600 transition-colors">Sair</button>
          </form>
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-6 flex gap-1 -mb-px">
          <button
            onClick={() => setTab('doencas')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === 'doencas'
                ? 'border-forest-500 text-forest-600'
                : 'border-transparent text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            <Stethoscope size={15} />
            Doenças
            <span className="badge bg-parchment-100 text-[var(--muted)] text-xs">{doencas.length}</span>
          </button>
          <button
            onClick={() => setTab('sugestoes')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === 'sugestoes'
                ? 'border-forest-500 text-forest-600'
                : 'border-transparent text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            <MessageSquare size={15} />
            Sugestões
            {pendentes > 0 && (
              <span className="badge status-revisao text-xs">{pendentes}</span>
            )}
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {tab === 'doencas' && (
          <DoencasTab doencas={doencas} complementos={complementos} />
        )}
        {tab === 'sugestoes' && (
          <SugestoesTab sugestoes={sugestoes} />
        )}
      </div>
    </main>
  );
}
