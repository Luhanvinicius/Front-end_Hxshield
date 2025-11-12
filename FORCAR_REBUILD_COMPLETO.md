# 🔧 Forçar Rebuild Completo - Solução Definitiva

## ❌ Problema Persiste:

Mesmo após limpar cache, ainda está tentando fazer requisições para:
```
http://108.165.179.162:5000/api/auth/login
```

**Isso significa que o código no Vercel ainda está com a versão antiga!**

---

## ✅ Solução: Forçar Rebuild Completo

### Passo 1: Verificar Código Local

Primeiro, vamos garantir que o código local está correto:

1. **Abra:** `web/config.ts`
2. **Verifique se está assim:**
   ```typescript
   export const API_URL = envUrl || (isHttps ? '/api/proxy' : 'https://api.hshield.pro/api');
   ```

3. **Abra:** `web/pages/api/proxy/[...path].ts`
4. **Verifique se está assim:**
   ```typescript
   const BACKEND_URL = process.env.BACKEND_API_URL || 'https://api.hshield.pro/api';
   ```

---

### Passo 2: Fazer Commit e Push

Se o código estiver correto, faça um commit para forçar novo deploy:

1. **Abra o terminal** na pasta do projeto
2. **Execute:**
   ```bash
   git add .
   git commit -m "fix: atualizar para HTTPS"
   git push
   ```

**Isso vai forçar um novo deploy no Vercel automaticamente!**

---

### Passo 3: Fazer Redeploy SEM Cache

Se não quiser fazer commit, force um rebuild completo:

1. **Vá em:** Vercel → **Deployments**
2. **Encontre o último deployment**
3. **Clique nos 3 pontos** (...)
4. **Escolha:** **Redeploy**
5. **IMPORTANTE:** **DESMARQUE** ☐ "Use existing Build Cache"
6. **Clique em:** **Redeploy**

**Isso vai fazer um rebuild completo, sem usar cache!**

---

### Passo 4: Verificar Variáveis de Ambiente

Enquanto o deploy roda, verifique novamente:

1. **Vá em:** **Settings** → **Environment Variables**
2. **Verifique:**
   - `BACKEND_API_URL` = `https://api.hshield.pro/api` ✅
   - `NEXT_PUBLIC_API_URL` = **NÃO DEVE EXISTIR** ✅

---

### Passo 5: Aguardar Deploy Terminar

1. **Vá em:** **Deployments**
2. **Aguarde até ver:** "Ready" ou "Success"
3. **Verifique a data/hora** do deployment
4. **Deve ser AGORA** (não antigo)

---

### Passo 6: Limpar TUDO Novamente

Após o deploy terminar:

1. **Cloudflare:** Purge Everything (novamente)
2. **Navegador:** Ctrl + Shift + Delete → Limpar cache
3. **Teste em:** Modo Anônimo (Ctrl + Shift + N)

---

## 🔍 Verificar se Funcionou

Após tudo isso:

1. **Abra:** `https://www.hshield.pro` (modo anônimo)
2. **Abra DevTools** (F12) → **Network**
3. **Tente fazer login**
4. **Verifique as requisições:**

✅ **CORRETO:**
- Requisições vão para: `/api/proxy/auth/login`
- Status: 200 OK
- Sem erros de Mixed Content

❌ **ERRADO:**
- Requisições vão para: `http://108.165.179.162:5000/api/auth/login`
- Erro: Mixed Content

---

## 🆘 Se Ainda Não Funcionar:

### Verificar Código no Deployment:

1. **Vá em:** **Deployments** → Último deployment
2. **Clique em:** **View Source** ou **Browse**
3. **Navegue até:** `.next/server/pages/api/proxy/[...path].js`
4. **Abra o arquivo** e procure por: `108.165.179.162`
5. **Se encontrar:** O código ainda está antigo

### Verificar Build Logs:

1. **Vá em:** **Deployments** → Último deployment
2. **Clique em:** **View Build Logs**
3. **Procure por:** `BACKEND_API_URL`
4. **Verifique se está:** `https://api.hshield.pro/api`

### Verificar se há múltiplos projetos:

1. **Verifique se há mais de um projeto** no Vercel
2. **Confirme qual projeto** está conectado ao domínio `www.hshield.pro`
3. **Verifique as variáveis** do projeto correto

---

## 📋 Checklist Completo:

- [ ] Código local verificado e correto
- [ ] Commit e push feito (ou redeploy sem cache)
- [ ] Variável `BACKEND_API_URL` = `https://api.hshield.pro/api`
- [ ] Variável `NEXT_PUBLIC_API_URL` não existe
- [ ] Deploy terminado (verificar data/hora)
- [ ] Cache do Cloudflare limpo novamente
- [ ] Cache do navegador limpo
- [ ] Testado em modo anônimo
- [ ] Verificado no Console (Network tab)
- [ ] Sem erros de Mixed Content

---

## 🚀 Ação Imediata:

**1. Faça um commit e push** (força deploy automático):
   ```bash
   git add .
   git commit -m "fix: atualizar para HTTPS"
   git push
   ```

**2. OU faça redeploy SEM cache:**
   - Deployments → 3 pontos → Redeploy
   - **DESMARQUE** "Use existing Build Cache"

**3. Aguarde deploy terminar**

**4. Limpe caches novamente**

**5. Teste em modo anônimo**

---

**O problema é que o código no Vercel ainda está antigo. Force um rebuild completo!**

