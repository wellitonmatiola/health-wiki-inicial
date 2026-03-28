Faça o commit e push de todas as alterações pendentes no projeto `health-wiki`.

Passos:
1. Execute `git status` para ver o que mudou
2. Execute `git diff` para entender as mudanças
3. Execute `git log -3 --oneline` para seguir o padrão de mensagens existente
4. Adicione os arquivos relevantes com `git add` (nunca use `git add -A` sem verificar antes — evite commitar `.env*` ou arquivos sensíveis)
5. Crie um commit com mensagem clara em português seguindo o padrão do projeto
6. Execute `git push origin main`
7. Informe o hash do commit e confirme que o push foi feito — o Vercel fará o deploy automaticamente
