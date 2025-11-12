# 📍 Onde Limpar Cache no Cloudflare

## 🎯 Passo a Passo Visual:

### 1. Acessar o Dashboard do Cloudflare

1. **Acesse:** https://dash.cloudflare.com
2. **Faça login** (se necessário)
3. **Selecione o domínio:** `hshield.pro`

---

### 2. Encontrar a Seção de Cache

**No menu lateral esquerdo:**

1. **Procure por:** **"Caching"** ou **"Cache"**
2. **Clique em:** **"Caching"** (está na lista do menu lateral)

**Se não encontrar, procure por:**
- **"Speed"** → **"Caching"** (dentro de Speed)
- Ou use a busca no topo

---

### 3. Limpar o Cache

Após clicar em **"Caching"**:

1. **Você verá várias abas/opções:**
   - Configuration
   - Purge Cache
   - Browser Cache TTL
   - etc.

2. **Clique em:** **"Purge Cache"** ou **"Configuration"**

3. **Na página que abrir, procure por:**
   - Botão: **"Purge Everything"**
   - Ou: **"Purge All Files"**
   - Ou: **"Clear All Cache"**

4. **Clique no botão** e confirme

---

## 🗺️ Caminho Completo:

```
Cloudflare Dashboard
  └─ Seu Domínio (hshield.pro)
      └─ Menu Lateral Esquerdo
          └─ "Caching" ou "Speed" → "Caching"
              └─ "Purge Cache" ou "Configuration"
                  └─ "Purge Everything"
```

---

## 📸 Onde Está no Menu:

**No menu lateral esquerdo, procure por:**

- ✅ **Caching** (pode estar sozinho)
- ✅ **Speed** → **Caching** (dentro de Speed)
- ✅ **Performance** → **Caching** (em alguns layouts)

**Está geralmente entre:**
- "SSL/TLS"
- "Security"
- "Speed" ou "Performance"
- "Caching" ← **AQUI!**

---

## 🔍 Se Não Encontrar:

### Opção 1: Usar a Busca

1. **No topo da página, há uma barra de busca**
2. **Digite:** "cache" ou "purge"
3. **Clique no resultado**

### Opção 2: URL Direta

Após fazer login e selecionar o domínio, acesse diretamente:

```
https://dash.cloudflare.com/[seu-account-id]/hshield.pro/caching
```

---

## 🚀 Alternativa Rápida:

### Limpar Cache por URL (Mais Rápido):

1. **No menu lateral, clique em:** **"Caching"**
2. **Procure por:** **"Purge by URL"** ou **"Custom Purge"**
3. **Digite:** `https://www.hshield.pro`
4. **Clique em:** **"Purge"**

---

## 📋 Resumo Visual:

```
┌─────────────────────────────────────┐
│  Cloudflare Dashboard               │
│                                     │
│  [Menu Lateral]                    │
│  ├─ Overview                        │
│  ├─ DNS                             │
│  ├─ SSL/TLS                         │
│  ├─ Security                        │
│  ├─ Speed                           │
│  │   └─ Caching ← AQUI!            │
│  ├─ Caching ← OU AQUI!             │
│  └─ ...                             │
└─────────────────────────────────────┘
```

---

## ✅ Depois de Limpar:

1. **Aguarde alguns segundos** (cache sendo limpo)
2. **Faça redeploy no Vercel** (se ainda não fez)
3. **Limpe cache do navegador** (Ctrl + Shift + Delete)
4. **Teste em modo anônimo**

---

**Procure por "Caching" no menu lateral esquerdo do Cloudflare!**

