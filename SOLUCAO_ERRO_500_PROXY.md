# 🔧 Solução: Erro 500 no Proxy do Vercel

## ❌ Problema

O proxy do Vercel está retornando erro 500 ao tentar conectar ao backend.

## 🔍 Possíveis Causas

1. **Vercel não consegue fazer requisições HTTP** (apenas HTTPS)
2. **Servidor não está acessível** da internet
3. **Firewall bloqueando** requisições da Vercel
4. **Timeout** na conexão

---

## ✅ Soluções

### Solução 1: Configurar Variável de Ambiente (RECOMENDADO)

Na Vercel, configure a variável de ambiente:

1. Acesse seu projeto na Vercel
2. Vá em **Settings** → **Environment Variables**
3. Adicione:
   - **Name:** `BACKEND_API_URL`
   - **Value:** `http://108.165.179.162:5000/api`
   - **Environment:** Production, Preview, Development

4. Faça um novo deploy

---

### Solução 2: Usar IP Direto (Alternativa)

Se o proxy não funcionar, configure para chamar o backend diretamente:

1. Na Vercel, adicione variável:
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `http://108.165.179.162:5000/api`
   - **Environment:** Production, Preview, Development

2. Isso fará o frontend chamar o backend diretamente (pode ter problemas de CORS)

---

### Solução 3: Verificar se o Servidor Está Acessível

Teste se o servidor está acessível da internet:

```bash
# Teste direto
curl http://108.165.179.162:5000/api/health

# Teste login
curl -X POST http://108.165.179.162:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

Se não funcionar, verifique:
- Servidor está rodando?
- Porta 5000 está aberta no firewall?
- Servidor está escutando em `0.0.0.0:5000` (não localhost)?

---

### Solução 4: Verificar Logs da Vercel

1. Acesse **Deployments** → Selecione o deployment → **Functions**
2. Clique na função `/api/proxy/[...path]`
3. Veja os logs de erro para identificar o problema específico

---

## 🚀 Solução Rápida

**Opção A - Configurar variável de ambiente:**
```
BACKEND_API_URL = http://108.165.179.162:5000/api
```

**Opção B - Usar IP direto (pode ter CORS):**
```
NEXT_PUBLIC_API_URL = http://108.165.179.162:5000/api
```

---

## 📝 Verificações Importantes

1. ✅ Servidor está rodando na VPS?
2. ✅ Servidor está escutando em `0.0.0.0:5000`?
3. ✅ Firewall permite porta 5000?
4. ✅ Servidor está acessível externamente?

---

## 🔄 Após Configurar

1. Faça um novo deploy na Vercel
2. Teste o login novamente
3. Verifique os logs se ainda não funcionar

