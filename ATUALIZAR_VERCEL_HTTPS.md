# ✅ Atualizar Vercel para HTTPS

## 🎉 SSL Instalado com Sucesso!

O backend agora está funcionando com HTTPS em `https://api.hshield.pro/api`

---

## 📋 Próximos Passos:

### 1. Atualizar Variável de Ambiente no Vercel

1. **Acesse:** https://vercel.com
2. **Vá em:** Seu Projeto → **Settings** → **Environment Variables**
3. **Encontre ou adicione:** `BACKEND_API_URL`
4. **Atualize o valor para:**
   ```
   https://api.hshield.pro/api
   ```
5. **Marque:** ☑ Production, ☑ Preview, ☑ Development
6. **Clique em:** **Save**

---

### 2. Fazer Novo Deploy

Após atualizar a variável:
1. **Vá em:** **Deployments**
2. **Clique em:** **Redeploy** no último deployment
3. **Ou faça um novo commit** para trigger automático

---

### 3. Testar

Após o deploy:
1. **Acesse:** `https://www.hshield.pro`
2. **Tente fazer login**
3. **Deve funcionar sem erros de Mixed Content!**

---

## ✅ Checklist:

- [ ] Variável `BACKEND_API_URL` atualizada para `https://api.hshield.pro/api`
- [ ] Novo deploy feito na Vercel
- [ ] Testado login no web deployado
- [ ] Sem erros de Mixed Content no console

---

## 🔍 Verificar se Está Funcionando:

### Teste no Navegador:
```
https://api.hshield.pro/api/health
```

**Deve retornar:**
```json
{"status":"ok","timestamp":"..."}
```

### Teste no Console do Navegador:
Abra o DevTools (F12) e verifique:
- ✅ Sem erros de Mixed Content
- ✅ Requisições para `https://api.hshield.pro` funcionando
- ✅ Login funcionando corretamente

---

**Atualize a variável no Vercel e faça um novo deploy!**
