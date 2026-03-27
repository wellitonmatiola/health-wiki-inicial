# 🌿 Health Wiki

Aplicação de consulta integrativa de doenças com visão médica, metafísica e holística.

## Stack

- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Banco de dados:** Supabase (PostgreSQL)
- **Deploy:** Vercel

---

## Configuração local

### 1. Instale as dependências

```bash
npm install
```

### 2. Configure as variáveis de ambiente

Copie o arquivo de exemplo e preencha:

```bash
cp .env.local.example .env.local
```

Edite `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://zzlloozbodvwpcufkpxm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_publishable_key_aqui
SUPABASE_SERVICE_KEY=sua_secret_key_aqui
ADMIN_PASSWORD=sua_senha_admin_aqui
```

### 3. Rode em desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:3000

---

## Deploy na Vercel

### 1. Suba o código para o GitHub

```bash
git init
git add .
git commit -m "feat: initial commit"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/health-wiki.git
git push -u origin main
```

### 2. Conecte na Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em **Add New → Project**
3. Importe o repositório `health-wiki` do GitHub
4. Configure as variáveis de ambiente:

| Variável | Valor |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Publishable key do Supabase |
| `SUPABASE_SERVICE_KEY` | Secret key do Supabase |
| `ADMIN_PASSWORD` | Senha para o painel admin |

5. Clique em **Deploy**

---

## Páginas

| Rota | Descrição |
|---|---|
| `/` | Busca de doenças |
| `/doencas/[id]` | Detalhes completos da doença |
| `/admin` | Painel de moderação (protegido) |
| `/admin/login` | Login do admin |

---

## Sincronização Notion → Supabase

Para atualizar os dados do banco quando editar o Notion:

```bash
# Na pasta health-wiki-sync
npm run sync
```

---

## Estrutura do projeto

```
health-wiki/
├── app/
│   ├── page.tsx                    # Busca de doenças
│   ├── doencas/[id]/page.tsx       # Detalhes
│   ├── admin/                      # Painel admin
│   └── api/                        # API routes
├── components/
│   └── SugestaoModal.tsx           # Modal de sugestão
├── lib/
│   ├── supabase.ts                 # Cliente Supabase
│   ├── types.ts                    # Tipos TypeScript
│   └── utils.ts                    # Utilitários
└── middleware.ts                   # Proteção de rotas admin
```
