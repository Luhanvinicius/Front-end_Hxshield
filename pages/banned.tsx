import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { API_URL } from '../config';

export default function BannedList() {
  const router = useRouter();
  const [bannedUsers, setBannedUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    loadBannedUsers();
    
    const interval = setInterval(() => {
      loadBannedUsers();
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const checkAuth = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) router.push('/');
    }
  };

  const loadBannedUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/auth/users/banned`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBannedUsers(response.data);
    } catch (error: any) {
      console.error('Error loading banned users:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('pt-BR');
  };

  const getBanTypeColor = (banType: string) => {
    if (banType === 'Automatic') return '#ff4444';
    if (banType === 'Manual') return '#ffaa00';
    if (banType === 'Web') return '#44aaff';
    return '#888';
  };

  const handleUnban = async (userId: number) => {
    if (!confirm('Deseja realmente desbanir este usuario?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/auth/users/${userId}/unban`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Usuario desbanido com sucesso!');
      loadBannedUsers();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erro ao desbanir usuario');
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
          <a href="/banned" style={{...navLinkStyle, ...activeLinkStyle}}>Lista de Banidos</a>
          <a href="/licenses" style={navLinkStyle}>Licencas</a>
          <a href="/clients" style={navLinkStyle}>Clientes</a>
        </nav>
        <div style={userInfoStyle}>
          <button onClick={() => { localStorage.clear(); router.push('/'); }} style={logoutBtnStyle}>
            Sair
          </button>
        </div>
      </div>

      <div style={mainStyle}>
        <h1 style={titleStyle}>Lista de Banidos</h1>

        {loading ? (
          <div style={loadingStyle}>Carregando...</div>
        ) : (
          <div style={tableStyle}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #2d3748' }}>
                  <th style={thStyle}>Usuario</th>
                  <th style={thStyle}>Nome</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Motivo</th>
                  <th style={thStyle}>Tipo</th>
                  <th style={thStyle}>Prova</th>
                  <th style={thStyle}>Banido em</th>
                  <th style={thStyle}>Expira em</th>
                  <th style={thStyle}>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {bannedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{textAlign: 'center', padding: '40px', color: '#888'}}>
                      Nenhum usuario banido encontrado
                    </td>
                  </tr>
                ) : (
                  bannedUsers.map((banned) => (
                    <tr key={banned.id} style={{ borderBottom: '1px solid #2d3748' }}>
                      <td style={tdStyle}>{banned.username}</td>
                      <td style={tdStyle}>{banned.fullName || 'N/A'}</td>
                      <td style={tdStyle}>{banned.email}</td>
                      <td style={tdStyle}>{banned.banReason || 'N/A'}</td>
                      <td style={{...tdStyle, color: getBanTypeColor(banned.banType)}}>
                        {banned.banType}
                      </td>
                      <td style={tdStyle}>{banned.banProof || 'N/A'}</td>
                      <td style={tdStyle}>{formatDate(banned.bannedAt)}</td>
                      <td style={tdStyle}>
                        {banned.banExpiresAt ? formatDate(banned.banExpiresAt) : 'Permanente'}
                      </td>
                      <td style={tdStyle}>
                        <button onClick={() => handleUnban(banned.id)} style={unbanButtonStyle}>
                          Desbanir
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
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
const activeLinkStyle = { background: '#e94560', color: '#eaeaea' };
const userInfoStyle = { marginTop: 'auto' };
const logoutBtnStyle = { width: '100%', padding: '10px', background: '#ff3366', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };
const mainStyle = { flex: 1, padding: '40px' };
const titleStyle = { color: '#eaeaea', fontSize: '32px', fontWeight: 'bold', marginBottom: '30px' };
const tableStyle = { background: '#1e2749', borderRadius: '10px', padding: '20px', border: '1px solid #2d3748' };
const thStyle = { padding: '15px', textAlign: 'left', color: '#888' };
const tdStyle = { padding: '15px', color: '#eaeaea' };
const loadingStyle = { color: '#eaeaea', fontSize: '18px', textAlign: 'center', padding: '40px' };
const unbanButtonStyle = { padding: '6px 12px', background: '#00ff88', color: '#0f1419', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' };

