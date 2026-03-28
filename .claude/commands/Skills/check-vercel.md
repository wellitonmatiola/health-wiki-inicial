Verifique o status atual do projeto na Vercel.

Passos:
1. Use o MCP da Vercel para buscar os deployments do projeto `health-wiki-inicial` (projectId: `prj_T8oVUCprLXs9w5OYGl89IvNHOkKO`, teamId: `team_nD85EMBq23JLse2oaf29NRPj`)
2. Mostre o status do deploy mais recente em produção: estado (READY, ERROR, BUILDING), data/hora, e hash do commit associado
3. Se o deploy estiver com erro, busque os logs de build ou runtime e identifique a causa
4. Compare o commit do deploy com o HEAD local (`git rev-parse HEAD`) para confirmar se a versão em produção está atualizada
5. Informe o URL de produção: https://health-wiki-inicial.vercel.app
