import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { API_URL } from '../config';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    nickname: '',
    fullName: '',
    cpf: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);
    
    try {
      await axios.post(`${API_URL}/auth/register`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: 'User',
        nickname: formData.nickname,
        fullName: formData.fullName,
        cpf: formData.cpf
      });
      
      alert('Cadastro realizado com sucesso! Você pode fazer login agora.');
      router.push('/');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erro ao realizar cadastro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>BlackSecurity</h1>
        <h2 style={subtitleStyle}>Cadastro de Jogador</h2>
        
        <form onSubmit={handleRegister} style={formStyle}>
          {error && (
            <div style={errorStyle}>
              {error}
            </div>
          )}
          
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Usuário</label>
            <input
              type="text"
              placeholder="Digite seu usuário"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              style={inputStyle}
              required
            />
          </div>
          
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Nome Completo</label>
            <input
              type="text"
              placeholder="Seu nome completo"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              style={inputStyle}
              required
            />
          </div>
          
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Nickname</label>
            <input
              type="text"
              placeholder="Mesmo nome do jogo"
              value={formData.nickname}
              onChange={(e) => setFormData({...formData, nickname: e.target.value})}
              style={inputStyle}
              required
            />
            <small style={{color: '#888', fontSize: '12px'}}>
              ⚠️ Deve ser IDÊNTICO ao nickname do seu jogo
            </small>
          </div>
          
          <div style={inputGroupStyle}>
            <label style={labelStyle}>CPF</label>
            <input
              type="text"
              placeholder="000.000.000-00"
              value={formData.cpf}
              onChange={(e) => setFormData({...formData, cpf: e.target.value})}
              style={inputStyle}
              required
            />
          </div>
          
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              style={inputStyle}
              required
            />
          </div>
          
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Senha</label>
            <input
              type="password"
              placeholder="Digite sua senha"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              style={inputStyle}
              required
            />
          </div>
          
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Confirmar Senha</label>
            <input
              type="password"
              placeholder="Digite a senha novamente"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              style={inputStyle}
              required
            />
          </div>
          
          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
          
          <div style={linkStyle}>
            <a href="/" style={linkTextStyle}>
              Já tem uma conta? Faça login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

// Styles
const containerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  background: '#0f1419',
  fontFamily: 'system-ui, -apple-system, sans-serif'
};

const cardStyle = {
  background: '#1a1a2e',
  padding: '40px',
  borderRadius: '15px',
  width: '400px',
  border: '1px solid #2d3748'
};

const titleStyle = {
  color: '#eaeaea',
  fontSize: '32px',
  fontWeight: 'bold',
  marginBottom: '10px',
  textAlign: 'center'
};

const subtitleStyle = {
  color: '#888',
  fontSize: '16px',
  marginBottom: '30px',
  textAlign: 'center'
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
};

const inputGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const labelStyle = {
  color: '#eaeaea',
  fontSize: '14px',
  fontWeight: '500'
};

const inputStyle = {
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #2d3748',
  background: '#0f1419',
  color: '#eaeaea',
  fontSize: '14px',
  outline: 'none'
};

const buttonStyle = {
  padding: '14px',
  background: '#0f3460',
  color: '#eaeaea',
  border: 'none',
  borderRadius: '8px',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'all 0.3s',
  marginTop: '10px'
};

const errorStyle = {
  background: '#ff3366',
  color: 'white',
  padding: '12px',
  borderRadius: '8px',
  fontSize: '14px',
  textAlign: 'center'
};

const linkStyle = {
  textAlign: 'center',
  marginTop: '10px'
};

const linkTextStyle = {
  color: '#0f3460',
  textDecoration: 'none',
  fontSize: '14px'
};

