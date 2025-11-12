# 🚀 Promover Deployment para Production

## ❌ Problema:

- **Deployment antigo (esquerda):** Está marcado como "Production" → Por isso aparece em "domains"
- **Deployment novo (direita):** Está em "Preview" → Por isso NÃO aparece em "domains"

**O domínio `www.hshield.pro` está usando o deployment antigo com código antigo!**

---

## ✅ Solução: Promover Deployment Novo para Production

### Passo 1: Promover o Deployment Novo

1. **Vá em:** Vercel → **Deployments**
2. **Encontre o deployment mais recente** (o da direita, com commit "fix: forçar HTTPS sempre, nunca HTTP")
3. **Clique nos 3 pontos** (...) no deployment
4. **Escolha:** **"Promote to Production"**
5. **Confirme** a ação

**Isso vai fazer o domínio `www.hshield.pro` apontar para o deployment novo!**

---

### Passo 2: Verificar

Após promover:

1. **Verifique se o deployment novo agora mostra:**
   - ✅ **Environment:** "Production Current"
   - ✅ **Domains:** `www.hshield.pro` aparece na lista

2. **O deployment antigo deve mostrar:**
   - ⚠️ **Environment:** "Production" (sem "Current")

---

### Passo 3: Limpar Caches

Após promover:

1. **Cloudflare:** Purge Everything
2. **Navegador:** Ctrl + Shift + Delete → Limpar cache
3. **Teste em:** Modo Anônimo (Ctrl + Shift + N)

---

### Passo 4: Testar

1. **Abra:** `https://www.hshield.pro` (modo anônimo)
2. **Abra DevTools** (F12) → **Network**
3. **Tente fazer login**
4. **Verifique:**
   - ✅ Requisições devem ir para: `/api/proxy/auth/login`
   - ✅ Status: 200 OK
   - ✅ Sem erros de Mixed Content

---

## 🔍 Diferença entre Preview e Production:

- **Preview:** Deployments de branches que não são `main` ou deployments de PRs
- **Production:** Deployment da branch `main` que está ativo no domínio

**O domínio sempre aponta para o deployment marcado como "Production Current"!**

---

## 📋 Checklist:

- [ ] Deployment novo promovido para Production
- [ ] `www.hshield.pro` aparece nos domains do deployment novo
- [ ] Cache do Cloudflare limpo
- [ ] Cache do navegador limpo
- [ ] Testado em modo anônimo
- [ ] Verificado no Console (Network tab)
- [ ] Sem erros de Mixed Content
- [ ] Login funcionando

---

**Promova o deployment novo para Production agora!**

