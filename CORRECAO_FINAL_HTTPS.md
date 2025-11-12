# ✅ Correção Final - Forçar HTTPS

## ✅ Correções Aplicadas:

1. **`web/config.ts` atualizado:**
   - Agora **SEMPRE força HTTPS** (nunca HTTP)
   - Se `NEXT_PUBLIC_API_URL` existir e for HTTP, converte automaticamente para HTTPS
   - Em ambiente HTTPS (Vercel), usa proxy `/api/proxy`
   - Em desenvolvimento local, usa `https://api.hshield.pro/api`

---

## 🚀 Próximos Passos:

### 1. Fazer Commit e Push

**Execute no terminal:**

```bash
cd web
git add .
git commit -m "fix: forçar HTTPS sempre, nunca HTTP"
git push
```

**Isso vai fazer deploy automático no Vercel!**

---

### 2. Aguardar Deploy

1. **Vá em:** Vercel → **Deployments**
2. **Aguarde até ver:** "Ready" ou "Success"
3. **Verifique a data/hora** (deve ser agora)

---

### 3. Limpar Caches

Após o deploy terminar:

1. **Cloudflare:** Purge Everything
2. **Navegador:** Ctrl + Shift + Delete → Limpar cache
3. **Teste em:** Modo Anônimo (Ctrl + Shift + N)

---

### 4. Testar

1. **Abra:** `https://www.hshield.pro` (modo anônimo)
2. **Abra DevTools** (F12) → **Network**
3. **Tente fazer login**
4. **Verifique:**
   - ✅ Requisições devem ir para: `/api/proxy/auth/login`
   - ✅ Status: 200 OK
   - ✅ Sem erros de Mixed Content

---

## 🔍 Verificar se Funcionou:

### No Console do Navegador:

Após fazer login, verifique:
- ✅ Sem erros de Mixed Content
- ✅ Requisições para `/api/proxy/...` funcionando
- ✅ Login funcionando corretamente

### No Network Tab:

1. **Filtre por:** "auth/login"
2. **Verifique:**
   - ✅ URL: `/api/proxy/auth/login` ou `https://api.hshield.pro/api/auth/login`
   - ❌ **NÃO deve ser:** `http://108.165.179.162:5000/api/auth/login`

---

## 📋 Checklist:

- [x] Código corrigido para sempre usar HTTPS ✅
- [ ] Commit e push feito
- [ ] Deploy terminado no Vercel
- [ ] Cache do Cloudflare limpo
- [ ] Cache do navegador limpo
- [ ] Testado em modo anônimo
- [ ] Verificado no Console (Network tab)
- [ ] Sem erros de Mixed Content
- [ ] Login funcionando

---

## 🆘 Se Ainda Não Funcionar:

### Verificar Build Logs:

1. **Vá em:** **Deployments** → Último deployment
2. **Clique em:** **View Build Logs**
3. **Procure por:** `API_URL` ou `config.ts`
4. **Verifique se o build foi bem-sucedido**

### Verificar Código no Deployment:

1. **Vá em:** **Deployments** → Último deployment
2. **Clique em:** **View Source** ou **Browse**
3. **Navegue até:** `.next/static/chunks/pages/index.js` (ou similar)
4. **Procure por:** `108.165.179.162`
5. **Se encontrar:** O código ainda está antigo (faça novo deploy)

---

**Faça commit e push agora para aplicar as correções!**

