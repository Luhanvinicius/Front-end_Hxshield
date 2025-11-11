# Guia de Deploy na Vercel - Troubleshooting

## Problema: Erro 500 no Proxy

Se você está recebendo erro 500 ao fazer requisições através do proxy na Vercel, siga estes passos:

### 1. Configurar Variável de Ambiente

Na Vercel, configure a variável de ambiente:

1. Acesse seu projeto na Vercel
2. Vá em **Settings** → **Environment Variables**
3. Adicione:
   - **Name:** `BACKEND_API_URL`
   - **Value:** `http://108.165.179.162:5000/api`
   - **Environment:** Production, Preview, Development

### 2. Verificar Acessibilidade do Backend

O backend precisa estar acessível da internet. Verifique:

- O servidor está rodando?
- A porta 5000 está aberta no firewall?
- O IP `108.165.179.162` está correto e acessível?

### 3. Verificar Logs da Vercel

1. Acesse **Deployments** → Selecione o deployment → **Functions**
2. Clique na função `/api/proxy/[...path]`
3. Veja os logs de erro para identificar o problema

### 4. Testar Backend Diretamente

Teste se o backend está respondendo:

```bash
curl -X POST http://108.165.179.162:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'
```

### 5. Possíveis Problemas e Soluções

#### Problema: Backend não acessível da Vercel
**Solução:** O backend precisa estar acessível publicamente. Se estiver em rede local, use um túnel (ngrok) ou configure um servidor público.

#### Problema: CORS no backend
**Solução:** Configure CORS no backend para aceitar requisições da Vercel:
```
Access-Control-Allow-Origin: https://front-end-hxshield.vercel.app
```

#### Problema: Timeout
**Solução:** O proxy tem timeout de 30 segundos. Se o backend demorar mais, aumente o timeout ou otimize o backend.

### 6. Alternativa: Usar Variável de Ambiente no Frontend

Se o proxy não funcionar, você pode configurar diretamente a URL do backend:

1. Na Vercel, adicione variável:
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `http://108.165.179.162:5000/api`
   - **Environment:** Production, Preview, Development

2. Isso fará o frontend chamar o backend diretamente (pode ter problemas de CORS se o backend não permitir)

### 7. Verificar se o Backend Aceita HTTP

A Vercel pode ter restrições para fazer requisições HTTP (não HTTPS). Se possível, configure o backend para usar HTTPS.

## Estrutura de Arquivos

O proxy está em: `pages/api/proxy/[...path].ts`

Este arquivo captura todas as requisições para `/api/proxy/*` e encaminha para o backend configurado.

## Testando Localmente

Para testar localmente:

```bash
npm run dev
```

O proxy funcionará em: `http://localhost:3000/api/proxy/auth/login`

## Próximos Passos

1. Verifique os logs da Vercel para ver o erro específico
2. Teste o backend diretamente
3. Configure as variáveis de ambiente
4. Faça um novo deploy

