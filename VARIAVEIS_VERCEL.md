# 🔧 Variáveis de Ambiente para Vercel

## ✅ Variável Obrigatória

### `BACKEND_API_URL`
**Obrigatória** - Usada pelo proxy server-side para conectar ao backend

- **Nome:** `BACKEND_API_URL`
- **Valor:** `http://108.165.179.162:5000/api`
- **Ambientes:** Production, Preview, Development (marque todos)
- **Descrição:** URL completa do backend API (com `/api` no final)

**Como adicionar:**
1. Acesse seu projeto na Vercel
2. Vá em **Settings** → **Environment Variables**
3. Clique em **Add New**
4. Preencha:
   - **Name:** `BACKEND_API_URL`
   - **Value:** `http://108.165.179.162:5000/api`
   - Marque: ☑ Production, ☑ Preview, ☑ Development
5. Clique em **Save**

---

## ⚙️ Variável Opcional

### `NEXT_PUBLIC_API_URL`
**Opcional** - Se configurada, o frontend usará esta URL diretamente (sem proxy)

- **Nome:** `NEXT_PUBLIC_API_URL`
- **Valor:** `http://108.165.179.162:5000/api`
- **Ambientes:** Production, Preview, Development
- **Descrição:** Se configurada, o frontend fará requisições diretas ao backend

**⚠️ ATENÇÃO:** 
- Se usar esta variável, o frontend fará requisições HTTP diretas
- Pode ter problemas de CORS se o backend não permitir
- **Recomendado:** Use apenas `BACKEND_API_URL` (proxy é mais seguro)

---

## 📋 Resumo Rápido

### Configuração Mínima (Recomendada):
```
BACKEND_API_URL = http://108.165.179.162:5000/api
```

### Configuração Completa (Opcional):
```
BACKEND_API_URL = http://108.165.179.162:5000/api
NEXT_PUBLIC_API_URL = http://108.165.179.162:5000/api
```

---

## 🚀 Como Funciona

### Com `BACKEND_API_URL` (Recomendado):
1. Frontend faz requisição para: `/api/proxy/auth/login`
2. Proxy server-side (Vercel) recebe a requisição
3. Proxy encaminha para: `http://108.165.179.162:5000/api/auth/login`
4. Resposta volta pelo proxy para o frontend

**Vantagens:**
- ✅ Evita problemas de CORS
- ✅ Mais seguro (backend não precisa expor CORS para frontend)
- ✅ Funciona mesmo com HTTP no backend

### Com `NEXT_PUBLIC_API_URL`:
1. Frontend faz requisição direta para: `http://108.165.179.162:5000/api/auth/login`
2. Backend precisa ter CORS configurado para aceitar requisições do domínio Vercel

**Desvantagens:**
- ⚠️ Requer CORS configurado no backend
- ⚠️ Pode ter problemas com mixed-content (HTTPS → HTTP)

---

## ✅ Checklist de Configuração

- [ ] Variável `BACKEND_API_URL` adicionada na Vercel
- [ ] Valor: `http://108.165.179.162:5000/api`
- [ ] Marcado para: Production, Preview, Development
- [ ] Deploy feito após adicionar variável
- [ ] Testado login no web deployado

---

## 🔍 Verificar se Está Funcionando

1. **Após adicionar a variável, faça um novo deploy**
2. **Acesse o web no Vercel e tente fazer login**
3. **Se funcionar, está configurado corretamente!**

---

## 📝 Notas Importantes

1. **Sempre faça um novo deploy após adicionar variáveis de ambiente**
2. **O valor deve terminar com `/api`** (ex: `http://108.165.179.162:5000/api`)
3. **Não use HTTPS se o backend está em HTTP** (a menos que tenha certificado SSL)
4. **O backend precisa estar acessível publicamente** (não pode estar em rede local)

---

## 🆘 Troubleshooting

### Erro 500 no proxy:
- Verifique se `BACKEND_API_URL` está configurada
- Verifique se o backend está rodando e acessível
- Verifique se a porta 5000 está aberta no firewall

### Erro de CORS:
- Use `BACKEND_API_URL` (proxy) ao invés de `NEXT_PUBLIC_API_URL`
- O proxy evita problemas de CORS

### Backend não acessível:
- Verifique se o servidor está rodando na VPS
- Teste: `curl http://108.165.179.162:5000/api/health`
- Verifique firewall da VPS

