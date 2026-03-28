Inicie o servidor de desenvolvimento local do projeto `health-wiki`.

Passos:
1. Verifique se já existe um processo Next.js rodando na porta 3000 com `lsof -ti:3000`
2. Se houver, pergunte ao usuário se deseja encerrar o processo existente antes de iniciar um novo
3. Acesse a pasta `health-wiki/` e inicie o servidor com `./node_modules/.bin/next dev` em background
4. Aguarde o servidor ficar pronto (mensagem "Ready") e confirme que está respondendo em http://localhost:3000
5. Informe ao usuário que o servidor está rodando e os URLs disponíveis (Local e Network)
