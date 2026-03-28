Realize uma auditoria de segurança completa no projeto `health-wiki` localizado em `health-wiki/`.

Verifique os seguintes pontos:

1. **Segredos expostos** — chaves de API, tokens, senhas hardcoded em qualquer arquivo de código ou configuração
2. **Arquivos sensíveis rastreados pelo git** — `.env*`, credenciais, chaves privadas que não deveriam estar no repositório
3. **Endpoints sem autenticação** — rotas em `app/api/` que deveriam exigir auth mas não exigem
4. **Validação de inputs** — ausência de validação de tipos, tamanhos e formatos nas rotas da API
5. **Configuração de cookies** — verificar `httpOnly`, `secure`, `sameSite` nos cookies de sessão
6. **Headers de segurança HTTP** — checar se CSP, X-Frame-Options, X-Content-Type-Options estão configurados em `next.config.mjs`
7. **Mensagens de erro** — verificar se erros internos do servidor estão sendo expostos nas respostas da API
8. **Rate limiting** — endpoints críticos (login, formulários públicos) possuem proteção contra abuso
9. **Dependências vulneráveis** — execute `npm audit` na pasta `health-wiki/` e reporte vulnerabilidades críticas ou altas

Ao final, apresente um relatório organizado por severidade: Crítico, Alto, Médio e Baixo, com o caminho do arquivo e linha do problema.
