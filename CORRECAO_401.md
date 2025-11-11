# ✅ Correção dos Erros 401 (Unauthorized)

## 🔧 Problema Identificado

O web estava recebendo erros 401 porque o token JWT não estava sendo enviado automaticamente em todas as requisições, diferente do cliente que usa `ApiService` com `SetToken()`.

## ✅ Solução Implementada

### 1. Criado `web/lib/axios.ts`
- Instância do axios configurada com `baseURL`
- **Interceptor de requisição**: Adiciona automaticamente o token do `localStorage` em todas as requisições
- **Interceptor de resposta**: Trata erros 401 redirecionando para login

### 2. Atualizadas todas as páginas para usar `apiClient`:
- ✅ `web/pages/index.tsx` (Login)
- ✅ `web/pages/dashboard.tsx`
- ✅ `web/pages/licenses.tsx`
- ✅ `web/pages/matches.tsx`
- ✅ `web/pages/players.tsx`
- ✅ `web/pages/gm-dashboard.tsx`
- ✅ `web/pages/banned.tsx`

### 3. Mudanças nas requisições:

**ANTES:**
```typescript
const token = localStorage.getItem('token');
await axios.get(`${API_URL}/license`, {
  headers: { Authorization: `Bearer ${token}` }
});
```

**DEPOIS:**
```typescript
await apiClient.get('/license');
// Token é adicionado automaticamente pelo interceptor
```

## 🎯 Benefícios

1. **Código mais limpo**: Não precisa mais buscar token manualmente
2. **Consistência**: Todas as requisições usam o mesmo padrão
3. **Manutenibilidade**: Mudanças no token são feitas em um único lugar
4. **Tratamento de erros**: 401 redireciona automaticamente para login

## 📝 Como Funciona

1. **Interceptor de Requisição:**
   - Antes de cada requisição, verifica se existe token no `localStorage`
   - Se existir, adiciona `Authorization: Bearer {token}` no header
   - Funciona automaticamente para todas as requisições

2. **Interceptor de Resposta:**
   - Se receber 401 (Unauthorized), remove token e redireciona para login
   - Garante que usuários não autenticados sejam redirecionados

## ✅ Status

- ✅ Interceptor criado e configurado
- ✅ Todas as páginas principais atualizadas
- ✅ Token sendo enviado automaticamente
- ✅ Erros 401 tratados corretamente

---

## 🚀 Próximos Passos

1. Testar o web localmente
2. Verificar se os erros 401 desapareceram
3. Confirmar que todas as requisições estão funcionando

