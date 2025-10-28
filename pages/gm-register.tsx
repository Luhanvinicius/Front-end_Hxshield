import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { API_URL } from '../config';

export default function GMRegister() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const createGM = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/auth/register-gm`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('GM cadastrado com sucesso!');
      setFormData({ username: '', email: '', password: '' });
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erro ao cadastrar GM');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={sidebarStyle}>
        <h2 style={logoStyle}>BlackSecurity</h2>
        <nav style={navStyle}>
          <a href="/dashboard" style={navLinkStyle}>Dashboard</a>
          <a href="/matches" style={navLinkStyle}>Partidas</a>
          <a href="/players" style={navLinkStyle}>Jogadores</a>
          <a href="/gm-register" style={{...navLinkStyle, ...activeLinkStyle}}>Cadastro de GM</a>
          <a href="/licenses" style={navLinkStyle}>Licenças</a>
          <a href="/clients" style={navLinkStyle}>Clientes</a>
          <a href="/banned" style={navLinkStyle}>Lista de Banidos</a>
          <a href="/detections" style={navLinkStyle}>Detecções</a>
        </nav>
        <div style={userInfoStyle}>
          <button onClick={() => { localStorage.clear(); router.push('/'); }} style={logoutBtnStyle}>
            Sair
          </button>
        </div>
      </div>

      <div style={mainStyle}>
        <h1 style={titleStyle}>Cadastro de Game Master</h1>
        
        <div style={cardStyle}>
          <form onSubmit={createGM}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                style={inputStyle}
                required
                placeholder="Digite o nome de usuário"
              />
            </div>
            
            <div style={formGroupStyle}>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                style={inputStyle}
                required
                placeholder="exemplo@email.com"
              />
            </div>
            
            <div style={formGroupStyle}>
              <label style={labelStyle}>Senha</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                style={inputStyle}
                required
                placeholder="Digite uma senha"
              />
            </div>
            
            <button type="submit" style={buttonStyle} disabled={loading}>
              {loading ? 'Cadastrando...' : 'Cadastrar GM'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Styles
const containerStyle = { display: 'flex', minHeight: '100vh', background: '#0f1419' };
const sidebarStyle = { width: '250px', background: '#1a1a2e', padding: '20px', display: 'flex', flexDirection: 'column', borderRight: '1px solid #16213e' };
const logoStyle = { color: '#eaeaea', fontSize: '24px', fontWeight: 'bold', marginBottom: '30px' };
const navStyle = { display: 'flex', flexDirection: 'column', gap: '10px' };
const navLinkStyle = { color: '#888', textDecoration: 'none', padding: '12px', borderRadius: '5px', transition: 'all 0.3s' };
const activeLinkStyle = { background: '#0f3460', color: '#eaeaea' };
const userInfoStyle = { marginTop: 'auto' };
const logoutBtnStyle = { width: '100%', padding: '10px', background: '#ff3366', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };
const mainStyle = { flex: 1, padding: '40px' };
const titleStyle = { color: '#eaeaea', fontSize: '32px', fontWeight: 'bold', marginBottom: '30px' };
const cardStyle = { background: '#1e2749', borderRadius: '10px', padding: '40px', border: '1px solid #2d3748', maxWidth: '500px' };
const formGroupStyle = { marginBottom: '25px' };
const labelStyle = { display: 'block', color: '#eaeaea', marginBottom: '8px', fontWeight: '500' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #2d3748', background: '#16213e', color: '#eaeaea', boxSizing: 'border-box', fontSize: '14px' };
const buttonStyle = { width: '100%', padding: '12px', background: '#ff6b6b', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' };
