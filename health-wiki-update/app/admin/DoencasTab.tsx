'use client';

import { useState, useMemo } from 'react';
import { Search, ChevronRight, Save, X, Plus, Trash2, ExternalLink } from 'lucide-react';
import type { DoencaResumo, Status } from '@/lib/types';
import { COR_CHAKRA } from '@/lib/utils';

interface Props {
  doencas: DoencaResumo[];
  complementos: Record<string, any[]>;
}

const STATUS_OPTIONS: Status[] = ['Em coleta', 'Revisão', 'Publicado'];
const STATUS_CLASS: Record<Status, string> = {
  'Publicado':  'status-publicado',
  'Revisão':    'status-revisao',
  'Em coleta':  'status-em-coleta',
};

// Cada tipo de relação e seus metadados
const RELACOES = [
  { tipo: 'chakras',           label: '🌈 Chakras',           idKey: 'chakra_id',       nomeKey: 'nome',  extras: [] },
  { tipo: 'causas_emocionais', label: '🥲 Causas Emocionais', idKey: 'causa_id',        nomeKey: 'emocao', extras: [] },
  { tipo: 'cristais',          label: '💎 Cristais',          idKey: 'cristal_id',      nomeKey: 'nome',  extras: ['forma_aplicacao'] },
  { tipo: 'chas',              label: '🍵 Chás',              idKey: 'cha_id',          nomeKey: 'nome',  extras: ['preparo', 'cuidados'] },
  { tipo: 'aromaterapia',      label: '🌺 Aromaterapia',      idKey: 'aromaterapia_id', nomeKey: 'oleo',  extras: ['via_diluicao'] },
  { tipo: 'cromoterapia',      label: '💡 Cromoterapia',      idKey: 'cromoterapia_id', nomeKey: 'luz',   extras: [] },
];

export default function DoencasTab({ doencas: inicial, complementos }: Props) {
  const [doencas, setDoencas] = useState(inicial);
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<Status | 'todos'>('todos');
  const [editando, setEditando] = useState<string | null>(null);
  const [form, setForm] = useState<any>(null);
  const [relacoes, setRelacoes] = useState<Record<string, any[]>>({});
  const [relacoesCarregadas, setRelacoesCarregadas] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [msgSalvo, setMsgSalvo] = useState('');
  const [buscaRel, setBuscaRel] = useState<Record<string, string>>({});

  const filtradas = useMemo(() => doencas.filter((d) => {
    const matchBusca = d.nome.toLowerCase().includes(busca.toLowerCase());
    const matchStatus = filtroStatus === 'todos' || d.status === filtroStatus;
    return matchBusca && matchStatus;
  }), [doencas, busca, filtroStatus]);

  async function abrirEditor(d: any) {
    setForm({ ...d });
    setEditando(d.id);
    setRelacoesCarregadas(false);
    setBuscaRel({});

    // Carrega relações existentes
    const res = await fetch(`/api/admin/doencas/${d.id}/relacoes-atual`);
    if (res.ok) {
      const data = await res.json();
      setRelacoes(data);
    }
    setRelacoesCarregadas(true);
  }

  function fecharEditor() {
    setEditando(null);
    setForm(null);
    setRelacoes({});
    setMsgSalvo('');
  }

  async function salvar() {
    if (!form) return;
    setSalvando(true);

    try {
      // Salva campos básicos
      const r1 = await fetch(`/api/admin/doencas/${form.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: form.nome,
          cid10: form.cid10,
          descricao_medica: form.descricao_medica,
          descricao_metafisica: form.descricao_metafisica,
          fontes: form.fontes,
          status: form.status,
        }),
      });
      if (!r1.ok) throw new Error('Erro ao salvar campos');

      // Salva cada relação
      for (const rel of RELACOES) {
        const items = relacoes[rel.tipo] ?? [];
        const ids = items.map((item: any) => item[rel.idKey] ?? item.id);
        const extras = rel.extras.length > 0
          ? items.map((item: any) => Object.fromEntries(rel.extras.map(e => [e, item[e] ?? null])))
          : undefined;

        await fetch(`/api/admin/doencas/${form.id}/relacoes`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tipo: rel.tipo, ids, extras }),
        });
      }

      // Atualiza lista local
      setDoencas((prev) => prev.map((d) => d.id === form.id ? { ...d, ...form } : d));
      setMsgSalvo('Salvo com sucesso!');
      setTimeout(() => setMsgSalvo(''), 3000);
    } catch (e: any) {
      alert('Erro: ' + e.message);
    } finally {
      setSalvando(false);
    }
  }

  function addRelacao(tipo: string, item: any, nomeKey: string, idKey: string) {
    const jaExiste = (relacoes[tipo] ?? []).some((r: any) => (r[idKey] ?? r.id) === item.id);
    if (jaExiste) return;
    setRelacoes((prev) => ({
      ...prev,
      [tipo]: [...(prev[tipo] ?? []), { ...item, [idKey]: item.id }],
    }));
  }

  function removeRelacao(tipo: string, itemId: string, idKey: string) {
    setRelacoes((prev) => ({
      ...prev,
      [tipo]: (prev[tipo] ?? []).filter((r: any) => (r[idKey] ?? r.id) !== itemId),
    }));
  }

  function updateExtras(tipo: string, itemId: string, idKey: string, field: string, value: string) {
    setRelacoes((prev) => ({
      ...prev,
      [tipo]: (prev[tipo] ?? []).map((r: any) =>
        (r[idKey] ?? r.id) === itemId ? { ...r, [field]: value } : r
      ),
    }));
  }

  const doencaAtual = doencas.find((d) => d.id === editando);

  return (
    <div className="flex gap-6" style={{ minHeight: 'calc(100vh - 140px)' }}>
      {/* Lista lateral */}
      <div className={`flex flex-col gap-3 ${editando ? 'w-72 shrink-0' : 'w-full'}`}>
        {/* Filtros */}
        <div className="flex gap-2 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input
              className="input pl-9 py-2 text-sm"
              placeholder="Buscar doença..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <select
            className="select text-sm"
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value as any)}
          >
            <option value="todos">Todos os status</option>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <p className="text-xs text-[var(--muted)]">{filtradas.length} doenças</p>

        {/* Lista */}
        <div className="space-y-1.5 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 230px)' }}>
          {filtradas.map((d) => (
            <button
              key={d.id}
              onClick={() => editando === d.id ? fecharEditor() : abrirEditor(d)}
              className={`card w-full text-left px-4 py-3 flex items-center justify-between gap-2 transition-all ${
                editando === d.id ? 'ring-2 ring-forest-500' : ''
              }`}
            >
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">{d.nome}</p>
                {d.cid10 && <p className="text-xs text-[var(--muted)] font-mono">{d.cid10.split(',')[0]}</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`badge text-xs ${STATUS_CLASS[d.status as Status]}`}>{d.status}</span>
                <ChevronRight size={14} className="text-[var(--muted)]" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      {editando && form && (
        <div className="flex-1 min-w-0 animate-fade-in">
          <div className="card p-6">
            {/* Cabeçalho do editor */}
            <div className="flex items-center justify-between mb-6 gap-4">
              <h2 className="font-serif text-2xl font-bold truncate">{doencaAtual?.nome}</h2>
              <div className="flex items-center gap-2 shrink-0">
                {msgSalvo && (
                  <span className="text-sm text-forest-600 font-medium">{msgSalvo}</span>
                )}
                <button onClick={fecharEditor} className="btn-secondary text-sm py-2 px-3">
                  <X size={15} /> Fechar
                </button>
                <button onClick={salvar} disabled={salvando} className="btn-primary text-sm py-2 px-4">
                  <Save size={15} />
                  {salvando ? 'Salvando...' : 'Salvar tudo'}
                </button>
              </div>
            </div>

            {/* Campos básicos */}
            <div className="space-y-4 mb-8">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Nome da doença</label>
                  <input
                    className="input"
                    value={form.nome ?? ''}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">CID-10</label>
                  <input
                    className="input"
                    placeholder="Ex: J00, F41.1"
                    value={form.cid10 ?? ''}
                    onChange={(e) => setForm({ ...form, cid10: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Status de publicação</label>
                <select
                  className="select"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Descrição médica</label>
                <textarea
                  className="textarea"
                  style={{ minHeight: 120 }}
                  value={form.descricao_medica ?? ''}
                  onChange={(e) => setForm({ ...form, descricao_medica: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Causa metafísica</label>
                <textarea
                  className="textarea"
                  style={{ minHeight: 120 }}
                  value={form.descricao_metafisica ?? ''}
                  onChange={(e) => setForm({ ...form, descricao_metafisica: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Fontes e referências</label>
                <textarea
                  className="textarea"
                  style={{ minHeight: 80 }}
                  value={form.fontes ?? ''}
                  onChange={(e) => setForm({ ...form, fontes: e.target.value })}
                />
              </div>
            </div>

            {/* Relações */}
            {!relacoesCarregadas ? (
              <p className="text-sm text-[var(--muted)]">Carregando relações...</p>
            ) : (
              <div className="space-y-6">
                <div className="divider">Relações e complementos</div>

                {RELACOES.map((rel) => {
                  const disponiveis = (complementos[rel.tipo] ?? []);
                  const selecionados = relacoes[rel.tipo] ?? [];
                  const selecionadosIds = new Set(selecionados.map((s: any) => s[rel.idKey] ?? s.id));
                  const termoBusca = buscaRel[rel.tipo] ?? '';
                  const filtrados = disponiveis.filter((item: any) =>
                    (item[rel.nomeKey] ?? '').toLowerCase().includes(termoBusca.toLowerCase())
                  );

                  return (
                    <div key={rel.tipo} className="border border-[var(--border)] rounded-xl p-4">
                      <h3 className="font-medium text-sm mb-3">{rel.label}</h3>

                      {/* Itens selecionados */}
                      {selecionados.length > 0 && (
                        <div className="space-y-2 mb-3">
                          {selecionados.map((item: any) => {
                            const itemId = item[rel.idKey] ?? item.id;
                            return (
                              <div key={itemId} className="bg-parchment-50 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-1">
                                  <p className="font-medium text-sm">
                                    {item.cor && (
                                      <span className={`inline-block w-2.5 h-2.5 rounded-full mr-2 ${COR_CHAKRA[item.cor] ?? 'bg-gray-400'}`} />
                                    )}
                                    {item[rel.nomeKey]}
                                  </p>
                                  <button
                                    onClick={() => removeRelacao(rel.tipo, itemId, rel.idKey)}
                                    className="text-red-400 hover:text-red-600 transition-colors"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                                {/* Campos extras específicos por doença */}
                                {rel.extras.map((field) => (
                                  <div key={field} className="mt-1.5">
                                    <label className="text-xs text-[var(--muted)] capitalize block mb-1">
                                      {field.replace(/_/g, ' ')}
                                    </label>
                                    <textarea
                                      className="textarea text-sm"
                                      style={{ minHeight: 60 }}
                                      placeholder={`${field.replace(/_/g, ' ')} específico para esta doença...`}
                                      value={item[field] ?? ''}
                                      onChange={(e) => updateExtras(rel.tipo, itemId, rel.idKey, field, e.target.value)}
                                    />
                                  </div>
                                ))}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Adicionar novo */}
                      <div>
                        <input
                          className="input text-sm mb-2"
                          placeholder={`Buscar ${rel.label.split(' ').slice(1).join(' ')}...`}
                          value={termoBusca}
                          onChange={(e) => setBuscaRel({ ...buscaRel, [rel.tipo]: e.target.value })}
                        />
                        {termoBusca && (
                          <div className="border border-[var(--border)] rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                            {filtrados.filter((item: any) => !selecionadosIds.has(item.id)).slice(0, 8).map((item: any) => (
                              <button
                                key={item.id}
                                onClick={() => {
                                  addRelacao(rel.tipo, item, rel.nomeKey, rel.idKey);
                                  setBuscaRel({ ...buscaRel, [rel.tipo]: '' });
                                }}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-parchment-50 flex items-center gap-2 border-b border-[var(--border)] last:border-0"
                              >
                                {item.cor && (
                                  <span className={`inline-block w-2.5 h-2.5 rounded-full shrink-0 ${COR_CHAKRA[item.cor] ?? 'bg-gray-400'}`} />
                                )}
                                <span className="truncate">{item[rel.nomeKey]}</span>
                                <Plus size={13} className="text-forest-500 ml-auto shrink-0" />
                              </button>
                            ))}
                            {filtrados.filter((item: any) => !selecionadosIds.has(item.id)).length === 0 && (
                              <p className="text-sm text-[var(--muted)] px-3 py-2">Nenhum resultado</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Link para página pública */}
            <div className="mt-6 pt-6 border-t border-[var(--border)]">
              <a
                href={`/doencas/${form.id}`}
                target="_blank"
                className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
              >
                <ExternalLink size={14} />
                Ver página pública desta doença
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
