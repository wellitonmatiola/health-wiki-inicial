export type Status = 'Em coleta' | 'Revisão' | 'Publicado';
export type TipoSugestao = 'correção' | 'complemento' | 'outro';
export type StatusSugestao = 'pendente' | 'aprovada' | 'rejeitada';

export interface Cha {
  id: string;
  nome: string;
  nome_cientifico: string | null;
  tipo: string[] | null;
  beneficios: string | null;
  preparo: string | null;
  cuidados: string | null;
}

export interface CausaEmocional {
  id: string;
  emocao: string;
  emocao_principal: string | null;
  descricao: string | null;
}

export interface Chakra {
  id: string;
  nome: string;
  sanscrito: string | null;
  cor: string | null;
  bija_mantra: string | null;
  elemento: string | null;
}

export interface Cristal {
  id: string;
  nome: string;
  beneficios: string | null;
  forma_aplicacao: string | null;
}

export interface Aromaterapia {
  id: string;
  oleo: string;
  beneficios: string | null;
  preocupacao_geral: string | null;
  via_diluicao: string | null;
}

export interface Cromoterapia {
  id: string;
  luz: string;
  proposta_acao: string | null;
  aplicacao: string | null;
  observacoes: string | null;
}

export interface Pergunta {
  id: string;
  pergunta: string;
}

export interface Doenca {
  id: string;
  notion_id: string;
  nome: string;
  cid10: string | null;
  descricao_medica: string | null;
  descricao_metafisica: string | null;
  reiki: string[] | null;
  status: Status;
  fontes: string | null;
  chas: Cha[];
  causas_emocionais: CausaEmocional[];
  chakras: Chakra[];
  cristais: Cristal[];
  aromaterapia: Aromaterapia[];
  cromoterapia: Cromoterapia[];
  perguntas: Pergunta[];
}

export interface DoencaResumo {
  id: string;
  nome: string;
  cid10: string | null;
  status: Status;
  descricao_medica: string | null;
  descricao_metafisica: string | null;
  fontes: string | null;
  reiki: string[] | null;
}

export interface Sugestao {
  id: string;
  doenca_id: string;
  tipo: TipoSugestao;
  campo: string | null;
  conteudo: string;
  nome_autor: string | null;
  email_autor: string | null;
  status: StatusSugestao;
  nota_admin: string | null;
  criado_em: string;
  moderado_em: string | null;
  doencas?: { nome: string };
}
