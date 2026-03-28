'use client';

import { useState, useMemo } from 'react';
import { Search, ChevronRight, Save, X, Plus, Trash2, ExternalLink, PlusCircle, AlertTriangle } from 'lucide-react';
import type { DoencaResumo, Status } from '@/lib/types';
import { COR_CHAKRA } from '@/lib/utils';

interface Props {
  doencas: DoencaResumo[];
  complementos: Record<string, any[]>;
}

const STATUS_OPTIONS: Status[] = ['Em coleta', 'Revisão', 'Publicado'];

function normalizar(str: string) {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}
const STATUS_CLASS: Record<Status, string> = {
  'Publicado': 'status-publicado',
  'Revisão': 'status-revisao',
  'Em coleta': 'status-em-coleta',
};

const RELACOES = [
  { tipo: 'chakras',           label: '🌈 Chakras',           idKey: 'chakra_id',       nomeKey: 'nome',  extras: [] },
  { tipo: 'causas_emocionais', label: '🥲 Causas Emocionais', idKey: 'causa_id',        nomeKey: 'emocao', extras: [] },
  { tipo: 'cristais',          label: '💎 Cristais',          idKey: 'cristal_id',      nomeKey: 'nome',  extras: ['forma_aplicacao'] },
  { tipo: 'chas',              label: '🍵 Chás',              idKey: 'cha_id',          nomeKey: 'nome',  extras: ['preparo', 'cuidados'] },
  { tipo: 'aromaterapia',      label: '🌺 Aromaterapia',      idKey: 'aromaterapia_id', nomeKey: 'oleo',  extras: ['via_diluicao'] },
  { tipo: 'cromoterapia',      label: '💡 Cromoterapia',      idKey: 'cromoterapia_id', nomeKey: 'luz',   extras: [] },
];

const FORM_VAZIO = {
  id: '',
  nome: '',
  cid10: '',
  descricao_medica: '',
  descricao_metafisica: '',
  fontes: '',
  fontes_medicas: '',
  fontes_metafisicas: '',
  fontes_complementares: '',
  status: 'Em coleta' as Status,
  reiki: [] as string[],
};

export default function DoencasTab({ doencas: inicial, complementos }: Props) {
  const [doencas, setDoencas] = useState(inicial);
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<Status | 'todos'>('todos');
  const [editando, setEditando] = useState<string | null>(null);
  const [criando, setCriando] = useState(false);
  const [form, setForm] = useState<any>(null);
  const [relacoes, setRelacoes] = useState<Record<string, any[]>>({});
  const [relacoesCarregadas, setRelacoesCarregadas] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [msgSalvo, setMsgSalvo] = useState('');
  const [buscaRel, setBuscaRel] = useState<Record<string, string>>({});
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtradas = useMemo(() => doencas.filter((d) => {
    const matchBusca = normalizar(d.nome).includes(normalizar(busca));
    const matchStatus = filtroStatus === 'todos' || d.status === filtroStatus;
    return matchBusca && matchStatus;
  }), [doencas, busca, filtroStatus]);

  const contadores = useMemo(() => ({
    total: doencas.length,
    publicado: doencas.filter(d => d.status === 'Publicado').length,
    revisao: doencas.filter(d => d.status === 'Revisão').length,
    coleta: doencas.filter(d => d.status === 'Em coleta').length,
  }), [doencas]);

  function novaDoenca() {
    setEditando(null);
    setCriando(true);
    setForm({ ...FORM_VAZIO });
    setRelacoes({});
    setRelacoesCarregadas(true);
    setMsgSalvo('');
    setBuscaRel({});
  }

  async function abrirEditor(d: any) {
    setCriando(false);
    setForm({ ...d });
    setEditando(d.id);
    setRelacoesCarregadas(false);
    setBuscaRel({});
    setMsgSalvo('');

    const res = await fetch(`/api/admin/doencas/${d.id}/relacoes-atual`);
    if (res.ok) {
      const data = await res.json();
      setRelacoes(data);
    }
    setRelacoesCarregadas(true);
  }

  function fechar() {
    setEditando(null);
    setCriando(false);
    setForm(null);
    setRelacoes({});
    setMsgSalvo('');
    setConfirmDelete(null);
  }

  async function salvar() {
    if (!form) return;
    setSalvando(true);

    try {
      if (criando) {
        // Criar nova doença
        const res = await fetch('/api/admin/doencas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error('Erro ao criar doença');
        const { doenca } = await res.json();

        // Salvar relações da nova doença
        await salvarRelacoes(doenca.id);

        setDoencas(prev => [doenca, ...prev].sort((a, b) => a.nome.localeCompare(b.nome)));
        setCriando(false);
        setEditando(doenca.id);
        setForm(doenca);
        setMsgSalvo('Doença criada com sucesso!');
      } else {
        // Atualizar existente
        const res = await fetch(`/api/admin/doencas/${form.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error('Erro ao salvar');

        await salvarRelacoes(form.id);

        setDoencas(prev => prev.map(d => d.id === form.id ? { ...d, ...form } : d));
        setMsgSalvo('Salvo com sucesso!');
      }

      setTimeout(() => setMsgSalvo(''), 3000);
    } catch (e: any) {
      alert('Erro: ' + e.message);
    } finally {
      setSalvando(false);
    }
  }

  async function salvarRelacoes(doencaId: string) {
    for (const rel of RELACOES) {
      const items = relacoes[rel.tipo] ?? [];
      const ids = items.map((item: any) => item[rel.idKey] ?? item.id);
      const extras = rel.extras.length > 0
        ? items.map((item: any) => Object.fromEntries(rel.extras.map(e => [e, item[e] ?? null])))
        : undefined;

      await fetch(`/api/admin/doencas/${doencaId}/relacoes`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo: rel.tipo, ids, extras }),
      });
    }
  }

  async function excluir(id: string) {
    const res = await fetch(`/api/admin/doencas/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setDoencas(prev => prev.filter(d => d.id !== id));
      fechar();
    } else {
      alert('Erro ao excluir');
    }
    setConfirmDelete(null);
  }

  function addRelacao(tipo: string, item: any, idKey: string) {
    const jaExiste = (relacoes[tipo] ?? []).some((r: any) => (r[idKey] ?? r.id) === item.id);
    if (jaExiste) return;
    setRelacoes(prev => ({ ...prev, [tipo]: [...(prev[tipo] ?? []), { ...item, [idKey]: item.id }] }));
  }

  function removeRelacao(tipo: string, itemId: string, idKey: string) {
    setRelacoes(prev => ({
      ...prev,
      [tipo]: (prev[tipo] ?? []).filter((r: any) => (r[idKey] ?? r.id) !== itemId),
    }));
  }

  function updateExtras(tipo: string, itemId: string, idKey: string, field: string, value: string) {
    setRelacoes(prev => ({
      ...prev,
      [tipo]: (prev[tipo] ?? []).map((r: any) =>
        (r[idKey] ?? r.id) === itemId ? { ...r, [field]: value } : r
      ),
    }));
  }

  const modoAberto = editando || criando;

  return (
    <div className="flex gap-6" style={{ minHeight: 'calc(100vh - 140px)' }}>
      {/* Lista lateral */}
      <div className={`flex flex-col gap-3 ${modoAberto ? 'w-72 shrink-0' : 'w-full'}`}>

        {/* Stats rápidas */}
        {!modoAberto && (
          <div className="grid grid-cols-4 gap-3 mb-2">
            {[
              { label: 'Total', val: contadores.total, cls: 'bg-parchment-100' },
              { label: 'Publicadas', val: contadores.publicado, cls: 'status-publicado' },
              { label: 'Revisão', val: contadores.revisao, cls: 'status-revisao' },
              { label: 'Em coleta', val: contadores.coleta, cls: 'status-em-coleta' },
            ].map(s => (
              <div key={s.label} className="card p-4 text-center">
                <p className="text-2xl font-serif font-bold">{s.val}</p>
                <span className={`badge ${s.cls} text-xs mt-1`}>{s.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Barra de ações */}
        <div className="flex gap-2 flex-wrap">
          <div className="relative flex-1 min-w-36">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input
              className="input pl-9 py-2 text-sm"
              placeholder="Buscar..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <select
            className="select text-sm"
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value as any)}
          >
            <option value="todos">Todos</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={novaDoenca} className="btn-primary text-sm py-2 px-3 shrink-0">
            <PlusCircle size={15} /> Nova doença
          </button>
        </div>

        <p className="text-xs text-[var(--muted)]">{filtradas.length} doenças</p>

        {/* Lista */}
        <div className="space-y-1.5 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>
          {filtradas.map((d) => (
            <button
              key={d.id}
              onClick={() => (editando === d.id && !criando) ? fechar() : abrirEditor(d)}
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

      {/* Editor / Criador */}
      {modoAberto && form && (
        <div className="flex-1 min-w-0 animate-fade-in">
          <div className="card p-6">
            {/* Cabeçalho */}
            <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
              <h2 className="font-serif text-2xl font-bold">
                {criando ? '✨ Nova doença' : form.nome}
              </h2>
              <div className="flex items-center gap-2 flex-wrap">
                {msgSalvo && <span className="text-sm text-forest-600 font-medium">{msgSalvo}</span>}
                {!criando && (
                  <button
                    onClick={() => setConfirmDelete(form.id)}
                    className="btn-secondary text-sm py-2 px-3 border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={14} /> Excluir
                  </button>
                )}
                <button onClick={fechar} className="btn-secondary text-sm py-2 px-3">
                  <X size={15} /> Fechar
                </button>
                <button onClick={salvar} disabled={salvando} className="btn-primary text-sm py-2 px-4">
                  <Save size={15} />
                  {salvando ? 'Salvando...' : criando ? 'Criar doença' : 'Salvar tudo'}
                </button>
              </div>
            </div>

            {/* Modal confirmação exclusão */}
            {confirmDelete && (
              <div className="mb-6 p-4 rounded-xl border border-red-200 bg-red-50 flex items-center gap-4">
                <AlertTriangle size={20} className="text-red-500 shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-red-700 text-sm">Excluir "{form.nome}"?</p>
                  <p className="text-xs text-red-600">Esta ação não pode ser desfeita. Todas as relações também serão removidas.</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => setConfirmDelete(null)} className="btn-secondary text-sm py-1.5 px-3">Cancelar</button>
                  <button onClick={() => excluir(form.id)} className="btn-primary text-sm py-1.5 px-3 bg-red-600 hover:bg-red-700">Confirmar</button>
                </div>
              </div>
            )}

            {/* Campos básicos */}
            <div className="space-y-4 mb-8">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Nome da doença *</label>
                  <input
                    className="input"
                    value={form.nome ?? ''}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    placeholder="Ex: Ansiedade, Diabetes..."
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
                <div className="flex gap-2">
                  {STATUS_OPTIONS.map(s => (
                    <button
                      key={s}
                      onClick={() => setForm({ ...form, status: s })}
                      className={`badge cursor-pointer transition-all ${
                        form.status === s
                          ? STATUS_CLASS[s] + ' ring-2 ring-offset-1 ring-forest-400'
                          : 'bg-parchment-100 text-[var(--muted)]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Descrição médica</label>
                <textarea
                  className="textarea"
                  style={{ minHeight: 120 }}
                  placeholder="Descrição clínica, sintomas, mecanismo fisiopatológico..."
                  value={form.descricao_medica ?? ''}
                  onChange={(e) => setForm({ ...form, descricao_medica: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Causa metafísica</label>
                <textarea
                  className="textarea"
                  style={{ minHeight: 120 }}
                  placeholder="Perspectiva emocional e metafísica da doença..."
                  value={form.descricao_metafisica ?? ''}
                  onChange={(e) => setForm({ ...form, descricao_metafisica: e.target.value })}
                />
              </div>

              <div className="space-y-3">
                <div className="divider text-xs">Fontes e referências</div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Fontes médicas</label>
                  <textarea
                    className="textarea"
                    style={{ minHeight: 70 }}
                    placeholder="Mayo Clinic, MedlinePlus, PubMed, Ministério da Saúde..."
                    value={form.fontes_medicas ?? ''}
                    onChange={(e) => setForm({ ...form, fontes_medicas: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Fontes metafísicas</label>
                  <textarea
                    className="textarea"
                    style={{ minHeight: 70 }}
                    placeholder="Louise Hay, Lise Bourbeau, Valcapelli, Dethlefsen..."
                    value={form.fontes_metafisicas ?? ''}
                    onChange={(e) => setForm({ ...form, fontes_metafisicas: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Fontes de terapias complementares</label>
                  <textarea
                    className="textarea"
                    style={{ minHeight: 70 }}
                    placeholder="Tisserand Institute, Crystal Bible, Reiki, fitoterapia..."
                    value={form.fontes_complementares ?? ''}
                    onChange={(e) => setForm({ ...form, fontes_complementares: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Relações */}
            {!relacoesCarregadas ? (
              <p className="text-sm text-[var(--muted)]">Carregando relações...</p>
            ) : (
              <div className="space-y-5">
                <div className="divider">Relações e complementos</div>

                {RELACOES.map((rel) => {
                  const disponiveis = complementos[rel.tipo] ?? [];
                  const selecionados = relacoes[rel.tipo] ?? [];
                  const selecionadosIds = new Set(selecionados.map((s: any) => s[rel.idKey] ?? s.id));
                  const termoBusca = buscaRel[rel.tipo] ?? '';
                  const filtrados = disponiveis.filter((item: any) =>
                    (item[rel.nomeKey] ?? '').toLowerCase().includes(termoBusca.toLowerCase())
                  );

                  return (
                    <div key={rel.tipo} className="border border-[var(--border)] rounded-xl p-4">
                      <h3 className="font-medium text-sm mb-3 flex items-center justify-between">
                        {rel.label}
                        <span className="text-xs text-[var(--muted)] font-normal">
                          {selecionados.length} selecionado{selecionados.length !== 1 ? 's' : ''}
                        </span>
                      </h3>

                      {/* Itens selecionados */}
                      {selecionados.length > 0 && (
                        <div className="space-y-2 mb-3">
                          {selecionados.map((item: any) => {
                            const itemId = item[rel.idKey] ?? item.id;
                            return (
                              <div key={itemId} className="bg-parchment-50 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-1">
                                  <p className="font-medium text-sm flex items-center gap-1.5">
                                    {item.cor && (
                                      <span className={`inline-block w-2.5 h-2.5 rounded-full ${COR_CHAKRA[item.cor] ?? 'bg-gray-400'}`} />
                                    )}
                                    {item[rel.nomeKey]}
                                  </p>
                                  <button
                                    onClick={() => removeRelacao(rel.tipo, itemId, rel.idKey)}
                                    className="text-red-400 hover:text-red-600 transition-colors p-0.5"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                                {rel.extras.map((field) => (
                                  <div key={field} className="mt-1.5">
                                    <label className="text-xs text-[var(--muted)] capitalize block mb-1">
                                      {field.replace(/_/g, ' ')}
                                    </label>
                                    <textarea
                                      className="textarea text-sm"
                                      style={{ minHeight: 56 }}
                                      placeholder={`${field.replace(/_/g, ' ')} para esta doença...`}
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

                      {/* Busca para adicionar */}
                      <input
                        className="input text-sm mb-2"
                        placeholder={`Adicionar ${rel.label.split(' ').slice(1).join(' ')}...`}
                        value={termoBusca}
                        onChange={(e) => setBuscaRel({ ...buscaRel, [rel.tipo]: e.target.value })}
                      />
                      {termoBusca && (
                        <div className="border border-[var(--border)] rounded-lg overflow-hidden max-h-44 overflow-y-auto">
                          {filtrados.filter((item: any) => !selecionadosIds.has(item.id)).slice(0, 8).map((item: any) => (
                            <button
                              key={item.id}
                              onClick={() => {
                                addRelacao(rel.tipo, item, rel.idKey);
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
                  );
                })}
              </div>
            )}

            {/* Link para página pública */}
            {!criando && (
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
            )}
          </div>
        </div>
      )}
    </div>
  );
}
