'use client';

import { useState } from 'react';
import { MessageSquarePlus, X, CheckCircle } from 'lucide-react';
import type { TipoSugestao } from '@/lib/types';

interface Props {
  doencaId: string;
  doencaNome: string;
}

export default function SugestaoModal({ doencaId, doencaNome }: Props) {
  const [open, setOpen] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    tipo: 'complemento' as TipoSugestao,
    campo: '',
    conteudo: '',
    nome_autor: '',
    email_autor: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/sugestoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doenca_id: doencaId, ...form }),
      });

      if (res.ok) {
        setEnviado(true);
        setTimeout(() => { setOpen(false); setEnviado(false); }, 2500);
      }
    } catch {
      alert('Erro ao enviar sugestão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-secondary text-sm">
        <MessageSquarePlus size={16} />
        Sugerir melhoria
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
          <div className="card w-full max-w-lg p-8 relative animate-fade-up">
            <button onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-[var(--muted)] hover:text-[var(--text)] transition-colors">
              <X size={20} />
            </button>

            {enviado ? (
              <div className="text-center py-8">
                <CheckCircle size={48} className="text-forest-500 mx-auto mb-4" />
                <h3 className="font-serif text-2xl font-semibold mb-2">Obrigado!</h3>
                <p className="text-[var(--muted)]">Sua sugestão foi enviada e será revisada em breve.</p>
              </div>
            ) : (
              <>
                <h3 className="font-serif text-2xl font-semibold mb-1">Sugerir melhoria</h3>
                <p className="text-sm text-[var(--muted)] mb-6">
                  Para <span className="font-medium text-[var(--text)]">{doencaNome}</span>
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Tipo de sugestão</label>
                    <select
                      className="select w-full"
                      value={form.tipo}
                      onChange={(e) => setForm({ ...form, tipo: e.target.value as TipoSugestao })}
                    >
                      <option value="complemento">Complementar informação</option>
                      <option value="correção">Corrigir informação</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      Campo relacionado <span className="text-[var(--muted)] font-normal">(opcional)</span>
                    </label>
                    <input
                      className="input"
                      placeholder="Ex: Descrição médica, Chás, Cristais..."
                      value={form.campo}
                      onChange={(e) => setForm({ ...form, campo: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Sua sugestão *</label>
                    <textarea
                      className="textarea"
                      placeholder="Descreva sua sugestão com o máximo de detalhes possível..."
                      required
                      value={form.conteudo}
                      onChange={(e) => setForm({ ...form, conteudo: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">
                        Nome <span className="text-[var(--muted)] font-normal">(opcional)</span>
                      </label>
                      <input
                        className="input"
                        placeholder="Seu nome"
                        value={form.nome_autor}
                        onChange={(e) => setForm({ ...form, nome_autor: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">
                        E-mail <span className="text-[var(--muted)] font-normal">(opcional)</span>
                      </label>
                      <input
                        className="input"
                        type="email"
                        placeholder="seu@email.com"
                        value={form.email_autor}
                        onChange={(e) => setForm({ ...form, email_autor: e.target.value })}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
                    {loading ? 'Enviando...' : 'Enviar sugestão'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
