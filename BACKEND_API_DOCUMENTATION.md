# Documentação da API - Recuperação de Senha

Esta documentação descreve os endpoints necessários no backend para implementar a funcionalidade de "Esqueci minha senha".

## Endpoints Necessários

### 1. POST `/api/auth/forgot-password`

**Descrição:** Solicita o envio de um token de recuperação de senha por e-mail.

**Request Body:**
```json
{
  "email": "usuario@exemplo.com"
}
```

**Response Success (200):**
```json
{
  "message": "E-mail de recuperação enviado com sucesso"
}
```

**Response Error (404):**
```json
{
  "message": "E-mail não encontrado"
}
```

**Lógica Esperada:**
1. Validar se o e-mail existe no banco de dados
2. Gerar um token único e seguro (ex: UUID ou token aleatório)
3. Salvar o token no banco de dados associado ao usuário com:
   - Data de expiração (recomendado: 1 hora)
   - Status (ativo/inativo)
4. Enviar e-mail com link: `https://seudominio.com/reset-password?token={token}`
5. Retornar sucesso (não revelar se o e-mail existe ou não por segurança)

**Exemplo de E-mail:**
```
Assunto: Recuperação de Senha - Hxshield

Olá,

Você solicitou a recuperação de senha. Clique no link abaixo para redefinir sua senha:

https://seudominio.com/reset-password?token={token}

Este link expira em 1 hora.

Se você não solicitou esta recuperação, ignore este e-mail.
```

---

### 2. GET `/api/auth/validate-reset-token/:token`

**Descrição:** Valida se um token de recuperação é válido e ainda não expirou.

**URL Parameters:**
- `token`: Token de recuperação

**Response Success (200):**
```json
{
  "valid": true,
  "message": "Token válido"
}
```

**Response Error (400/404):**
```json
{
  "valid": false,
  "message": "Token inválido ou expirado"
}
```

**Lógica Esperada:**
1. Buscar o token no banco de dados
2. Verificar se o token existe
3. Verificar se o token não expirou (comparar com data atual)
4. Verificar se o token está ativo
5. Retornar se é válido ou não

---

### 3. POST `/api/auth/reset-password`

**Descrição:** Redefine a senha do usuário usando o token de recuperação.

**Request Body:**
```json
{
  "token": "token-gerado-anteriormente",
  "newPassword": "novaSenha123"
}
```

**Response Success (200):**
```json
{
  "message": "Senha redefinida com sucesso"
}
```

**Response Error (400):**
```json
{
  "message": "Token inválido ou expirado"
}
```

**Lógica Esperada:**
1. Validar o token (mesma lógica do endpoint anterior)
2. Validar a nova senha (mínimo 6 caracteres, etc.)
3. Hash da nova senha (usar bcrypt ou similar)
4. Atualizar a senha do usuário no banco de dados
5. Invalidar o token (marcar como usado ou deletar)
6. Retornar sucesso

---

## Estrutura de Banco de Dados Sugerida

### Tabela: `password_reset_tokens`

```sql
CREATE TABLE password_reset_tokens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_user_id (user_id)
);
```

**Ou se usar SQL Server:**
```sql
CREATE TABLE password_reset_tokens (
    id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    token NVARCHAR(255) NOT NULL UNIQUE,
    expires_at DATETIME2 NOT NULL,
    used BIT DEFAULT 0,
    created_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_token ON password_reset_tokens(token);
CREATE INDEX idx_user_id ON password_reset_tokens(user_id);
```

---

## Exemplo de Implementação (Pseudocódigo)

### Endpoint: forgot-password
```javascript
POST /api/auth/forgot-password
async function forgotPassword(req, res) {
  const { email } = req.body;
  
  // 1. Buscar usuário por email
  const user = await db.users.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "E-mail não encontrado" });
  }
  
  // 2. Gerar token único
  const token = crypto.randomBytes(32).toString('hex');
  
  // 3. Calcular data de expiração (1 hora)
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1);
  
  // 4. Salvar token no banco
  await db.passwordResetTokens.create({
    user_id: user.id,
    token: token,
    expires_at: expiresAt,
    used: false
  });
  
  // 5. Enviar e-mail
  const resetLink = `${FRONTEND_URL}/reset-password?token=${token}`;
  await emailService.send({
    to: email,
    subject: 'Recuperação de Senha - Hxshield',
    html: `Clique aqui para redefinir sua senha: ${resetLink}`
  });
  
  // 6. Retornar sucesso
  return res.json({ message: "E-mail de recuperação enviado com sucesso" });
}
```

### Endpoint: validate-reset-token
```javascript
GET /api/auth/validate-reset-token/:token
async function validateResetToken(req, res) {
  const { token } = req.params;
  
  // 1. Buscar token no banco
  const resetToken = await db.passwordResetTokens.findOne({ 
    token: token,
    used: false
  });
  
  if (!resetToken) {
    return res.status(400).json({ 
      valid: false,
      message: "Token inválido ou expirado" 
    });
  }
  
  // 2. Verificar se expirou
  if (new Date() > resetToken.expires_at) {
    return res.status(400).json({ 
      valid: false,
      message: "Token inválido ou expirado" 
    });
  }
  
  return res.json({ 
    valid: true,
    message: "Token válido" 
  });
}
```

### Endpoint: reset-password
```javascript
POST /api/auth/reset-password
async function resetPassword(req, res) {
  const { token, newPassword } = req.body;
  
  // 1. Validar token
  const resetToken = await db.passwordResetTokens.findOne({ 
    token: token,
    used: false
  });
  
  if (!resetToken || new Date() > resetToken.expires_at) {
    return res.status(400).json({ 
      message: "Token inválido ou expirado" 
    });
  }
  
  // 2. Validar senha
  if (newPassword.length < 6) {
    return res.status(400).json({ 
      message: "A senha deve ter pelo menos 6 caracteres" 
    });
  }
  
  // 3. Hash da nova senha
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  // 4. Atualizar senha do usuário
  await db.users.update(
    { id: resetToken.user_id },
    { password: hashedPassword }
  );
  
  // 5. Marcar token como usado
  await db.passwordResetTokens.update(
    { id: resetToken.id },
    { used: true }
  );
  
  return res.json({ 
    message: "Senha redefinida com sucesso" 
  });
}
```

---

## Segurança

1. **Rate Limiting:** Implementar limite de tentativas por IP (ex: 3 tentativas por hora)
2. **Token Seguro:** Usar tokens criptograficamente seguros (mínimo 32 caracteres)
3. **Expiração:** Tokens devem expirar em no máximo 1 hora
4. **Uso Único:** Tokens devem ser invalidados após uso
5. **Não Revelar:** Não revelar se um e-mail existe ou não (por segurança)
6. **HTTPS:** Sempre usar HTTPS em produção
7. **Validação:** Validar formato de e-mail e força da senha

---

## Variáveis de Ambiente Necessárias

```env
# URL do frontend (para links no e-mail)
FRONTEND_URL=https://seudominio.com

# Configurações de e-mail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-app
SMTP_FROM=noreply@seudominio.com
```

---

## Notas Importantes

- O frontend já está implementado e pronto para usar
- Os endpoints devem seguir exatamente os nomes e estruturas descritas
- O token deve ser passado via query parameter na URL: `/reset-password?token=xxx`
- O e-mail deve conter um link clicável com o token
- Implementar logs para auditoria de tentativas de recuperação

