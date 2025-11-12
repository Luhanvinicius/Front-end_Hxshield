# 🔧 Corrigir Erro de Mixed Content

## ❌ Erro:

```
Mixed Content: The page at 'https://www.hshield.pro/' was loaded over HTTPS, 
but requested an insecure XMLHttpRequest endpoint 'http://108.165.179.162:5000/api/auth/login'. 
This request has been blocked; the content must be served over HTTPS.
```

## 🔍 Causa:

O web app no Vercel ainda está usando a URL HTTP antiga. Isso pode acontecer por:

1. **Variável de ambiente no Vercel ainda está com HTTP**
2. **Deploy antigo ainda está ativo** (cache)
3. **Código não foi atualizado no deploy**

---

## ✅ Solução:

### 1. Atualizar Variável de Ambiente no Vercel

1. **Acesse:** https://vercel.com
2. **Vá em:** Seu Projeto → **Settings** → **Environment Variables**
3. **Encontre:** `BACKEND_API_URL`
4. **Se existir, edite. Se não existir, adicione:**
   - **Name:** `BACKEND_API_URL`
   - **Value:** `https://api.hshield.pro/api`
   - **Marque:** ☑ Production, ☑ Preview, ☑ Development
5. **Clique em:** **Save**

### 2. Verificar se `NEXT_PUBLIC_API_URL` existe

Se existir a variável `NEXT_PUBLIC_API_URL`:
1. **Delete ela** (não é necessária)
2. **Ou atualize para:** `https://api.hshield.pro/api`

### 3. Fazer Novo Deploy

**IMPORTANTE:** Após atualizar as variáveis:

1. **Vá em:** **Deployments**
2. **Encontre o último deployment**
3. **Clique nos 3 pontos** (...) → **Redeploy**
4. **Ou faça um novo commit** para trigger automático

### 4. Limpar Cache do Navegador

Após o novo deploy:
1. **Pressione:** `Ctrl + Shift + Delete`
2. **Marque:** "Imagens e arquivos em cache"
3. **Clique em:** "Limpar dados"
4. **Ou use:** `Ctrl + F5` para hard refresh

---

## 🔍 Verificar se Está Correto:

### 1. Verificar Variáveis no Vercel:

- `BACKEND_API_URL` = `https://api.hshield.pro/api`
- `NEXT_PUBLIC_API_URL` = **NÃO DEVE EXISTIR** (ou deve ser HTTPS)

### 2. Verificar no Console do Navegador:

Após o novo deploy e limpar cache:
1. **Abra DevTools** (F12)
2. **Vá em:** Network
3. **Tente fazer login**
4. **Verifique as requisições:**
   - ✅ Devem ir para: `/api/proxy/auth/login` (proxy do Vercel)
   - ✅ Ou para: `https://api.hshield.pro/api/auth/login` (se usar NEXT_PUBLIC_API_URL)
   - ❌ **NÃO devem ir para:** `http://108.165.179.162:5000`

---

## 📋 Checklist:

- [ ] Variável `BACKEND_API_URL` atualizada para `https://api.hshield.pro/api` no Vercel
- [ ] Variável `NEXT_PUBLIC_API_URL` deletada ou atualizada para HTTPS
- [ ] Novo deploy feito na Vercel
- [ ] Cache do navegador limpo
- [ ] Testado login novamente
- [ ] Sem erros de Mixed Content no console

---

## 🆘 Se Ainda Não Funcionar:

### Verificar o código no Vercel:

1. **Vá em:** **Deployments** → Último deployment
2. **Clique em:** "View Function Logs" ou "View Build Logs"
3. **Verifique se:** `BACKEND_API_URL` está sendo usada corretamente

### Verificar no código local:

O arquivo `web/config.ts` deve estar assim:
```typescript
export const API_URL = envUrl || (isHttps ? '/api/proxy' : 'https://api.hshield.pro/api');
```

**Se estiver diferente, atualize e faça commit + deploy.**

---

**Atualize a variável no Vercel e faça um novo deploy!**

