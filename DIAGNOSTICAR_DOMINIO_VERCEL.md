# 🔍 Diagnosticar Erro no Domínio vs Vercel

## ❌ Problema:

- ✅ **No Vercel direto:** Funciona e consegue logar
- ❌ **No domínio www.hshield.pro:** Erro de Mixed Content (HTTP)

## 🔍 Causa Provável:

O deploy no Vercel para o domínio `www.hshield.pro` ainda está usando código/variáveis antigas.

---

## ✅ Solução Passo a Passo:

### 1. Verificar Variáveis de Ambiente no Vercel

1. **Acesse:** https://vercel.com
2. **Vá em:** Seu Projeto → **Settings** → **Environment Variables**
3. **Verifique TODAS as variáveis:**

#### Variável `BACKEND_API_URL`:
- **Deve estar:** `https://api.hshield.pro/api`
- **Se estiver:** `http://108.165.179.162:5000/api` → **ATUALIZE!**

#### Variável `NEXT_PUBLIC_API_URL`:
- **Se existir e estiver:** `http://108.165.179.162:5000/api` → **DELETE ou ATUALIZE!**
- **Recomendado:** **DELETE** (não é necessária)

---

### 2. Fazer Novo Deploy OBRIGATÓRIO

**IMPORTANTE:** Após atualizar variáveis, você DEVE fazer um novo deploy:

#### Opção A: Redeploy (Mais Rápido)
1. **Vá em:** **Deployments**
2. **Encontre o último deployment**
3. **Clique nos 3 pontos** (...) → **Redeploy**
4. **Marque:** ☑ "Use existing Build Cache" (desmarque se quiser rebuild completo)
5. **Clique em:** **Redeploy**

#### Opção B: Novo Commit (Recomendado)
1. **Faça um pequeno commit** (ex: atualizar README)
2. **Push para o repositório**
3. **Vercel fará deploy automático**

---

### 3. Verificar Qual Deployment Está Ativo

1. **Vá em:** **Deployments**
2. **Verifique qual deployment está marcado como "Production"**
3. **Se for um deployment antigo:**
   - Clique nos 3 pontos (...) → **Promote to Production**

---

### 4. Limpar Cache do Cloudflare (Se Usar)

Se o Cloudflare está fazendo proxy (orange cloud):

1. **Acesse:** Cloudflare Dashboard
2. **Vá em:** **Caching** → **Configuration**
3. **Clique em:** **Purge Everything**
4. **Ou:** **Purge by URL** → `https://www.hshield.pro`

---

### 5. Limpar Cache do Navegador

Após o novo deploy:

1. **Pressione:** `Ctrl + Shift + Delete`
2. **Marque:** "Imagens e arquivos em cache"
3. **Clique em:** "Limpar dados"
4. **Ou use:** `Ctrl + F5` para hard refresh
5. **Ou use:** Modo Anônimo para testar

---

## 🔍 Verificar se Está Correto:

### 1. Verificar no Console do Navegador:

Após novo deploy e limpar cache:

1. **Abra:** `https://www.hshield.pro`
2. **Abra DevTools** (F12) → **Network**
3. **Tente fazer login**
4. **Verifique as requisições:**

✅ **CORRETO:**
- Requisições vão para: `/api/proxy/auth/login`
- Ou para: `https://api.hshield.pro/api/auth/login`

❌ **ERRADO:**
- Requisições vão para: `http://108.165.179.162:5000/api/auth/login`

---

### 2. Verificar Variáveis no Build Log:

1. **Vá em:** **Deployments** → Último deployment
2. **Clique em:** **View Build Logs**
3. **Procure por:** `BACKEND_API_URL` ou `NEXT_PUBLIC_API_URL`
4. **Verifique se estão com HTTPS**

---

## 📋 Checklist Completo:

- [ ] Variável `BACKEND_API_URL` = `https://api.hshield.pro/api` no Vercel
- [ ] Variável `NEXT_PUBLIC_API_URL` deletada ou atualizada para HTTPS
- [ ] Novo deploy feito na Vercel (Redeploy ou novo commit)
- [ ] Deployment correto está marcado como "Production"
- [ ] Cache do Cloudflare limpo (se usar proxy)
- [ ] Cache do navegador limpo
- [ ] Testado em modo anônimo
- [ ] Verificado no Console (Network tab)
- [ ] Sem erros de Mixed Content

---

## 🆘 Se Ainda Não Funcionar:

### Verificar se há múltiplos projetos no Vercel:

1. **Verifique se há mais de um projeto** para o mesmo repositório
2. **Confirme qual projeto está conectado** ao domínio `www.hshield.pro`
3. **Verifique as variáveis de ambiente** do projeto correto

### Verificar configuração do domínio:

1. **Vá em:** **Settings** → **Domains**
2. **Verifique se:** `www.hshield.pro` está configurado corretamente
3. **Verifique qual deployment** está sendo usado para este domínio

### Verificar código no deployment:

1. **Vá em:** **Deployments** → Último deployment
2. **Clique em:** **View Source** ou **Browse**
3. **Verifique o arquivo:** `.next/server/pages/api/proxy/[...path].js`
4. **Procure por:** `BACKEND_URL` ou `108.165.179.162`
5. **Deve estar:** `https://api.hshield.pro/api`

---

## 🚀 Solução Rápida:

1. **Delete a variável `NEXT_PUBLIC_API_URL`** (se existir)
2. **Atualize `BACKEND_API_URL`** para `https://api.hshield.pro/api`
3. **Faça Redeploy** do último deployment
4. **Limpe cache** do navegador e Cloudflare
5. **Teste em modo anônimo**

---

**O problema é que o Vercel ainda está usando variáveis/código antigos. Atualize as variáveis e faça um novo deploy!**

