import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { API_URL } from '../config';

export default function Players() {
  const router = useRouter();
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    loadPlayers();
    
    // Atualiza a cada 3 segundos
    const interval = setInterval(() => {
      loadPlayers();
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const checkAuth = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) router.push('/');
    }
  };

  const loadPlayers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/auth/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Users loaded:', response.data);
      console.log('Count:', response.data?.length || 0);
      setPlayers(response.data);
    } catch (error: any) {
      console.error('Error loading users:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('pt-BR');
  };

  const getStatusColor = (player: any) => {
    if (player.finishedAt) return '#888';
    if (player.startedAt) return '#00ff88';
    if (player.connectedAt) return '#4a9eff';
    return '#eaeaea';
  };

  const getStatusText = (player: any) => {
    if (player.finishedAt) return 'Finalizado';
    if (player.startedAt) return 'Monitorando';
    if (player.connectedAt) return 'Conectado';
    return 'Inativo';
  };

  const handleBan = async (userId: number, username: string) => {
    const reason = prompt(`Digite o motivo do banimento para ${username}:`);
    if (!reason) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/auth/users/${userId}/ban`, 
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`${username} foi banido!`);
      loadPlayers();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erro ao banir usuário');
    }
  };

  const handleUnban = async (userId: number, username: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/auth/users/${userId}/unban`, 
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`${username} foi desbanido!`);
      loadPlayers();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erro ao desbanir usuário');
    }
  };

  return (
    <div style={containerStyle}>
      <div style={sidebarStyle}>
        <h2 style={logoStyle}>BlackSecurity</h2>
        <nav style={navStyle}>
          <a href="/dashboard" style={navLinkStyle}>Dashboard</a>
          <a href="/matches" style={navLinkStyle}>Partidas</a>
          <a href="/players" style={{...navLinkStyle, ...activeLinkStyle}}>Jogadores</a>
          <a href="/gm-register" style={navLinkStyle}>Cadastro de GM</a>
          <a href="/licenses" style={navLinkStyle}>Licenças</a>
          <a href="/clients" style={navLinkStyle}>Clientes</a>
          <a href="/banned" style={navLinkStyle}>Lista de Banidos</a>
        </nav>
        <div style={userInfoStyle}>
          <button onClick={() => { localStorage.clear(); router.push('/'); }} style={logoutBtnStyle}>
            Sair
          </button>
        </div>
      </div>

      <div style={mainStyle}>
        <h1 style={titleStyle}>Jogadores</h1>

        {loading ? (
          <div style={loadingStyle}>Carregando...</div>
        ) : (
          <div style={tableStyle}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #2d3748' }}>
                  <th style={thStyle}>Username</th>
                  <th style={thStyle}>Nome</th>
                  <th style={thStyle}>Nickname</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>CPF</th>
                  <th style={thStyle}>Cadastrado em</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {players.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{textAlign: 'center', padding: '40px', color: '#888'}}>
                      Nenhum jogador encontrado
                    </td>
                  </tr>
                ) : (
                  players.map((player) => (
                    <tr key={player.id} style={{ borderBottom: '1px solid #2d3748' }}>
                      <td style={tdStyle}>{player.username}</td>
                      <td style={tdStyle}>{player.fullName || 'Não informado'}</td>
                      <td style={tdStyle}>{player.nickname || 'Não informado'}</td>
                      <td style={tdStyle}>{player.email}</td>
                      <td style={tdStyle}>{player.cpf || 'Não informado'}</td>
                      <td style={tdStyle}>{formatDate(player.createdAt)}</td>
                      <td style={{...tdStyle, color: player.isActive ? '#00ff88' : '#ff6b6b'}}>
                        {player.isActive ? 'Ativo' : 'Inativo'}
                      </td>
                      <td style={tdStyle}>
                        {player.isActive ? (
                          <button onClick={() => handleBan(player.id, player.username)} style={banButtonStyle}>
                            Banir
                          </button>
                        ) : (
                          <button onClick={() => handleUnban(player.id, player.username)} style={unbanButtonStyle}>
                            Desbanir
                          </button>
                        )}
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
const activeLinkStyle = { background: '#0f3460', color: '#eaeaea' };
const userInfoStyle = { marginTop: 'auto' };
const logoutBtnStyle = { width: '100%', padding: '10px', background: '#ff3366', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };
const mainStyle = { flex: 1, padding: '40px' };
const titleStyle = { color: '#eaeaea', fontSize: '32px', fontWeight: 'bold', marginBottom: '30px' };
const tableStyle = { background: '#1e2749', borderRadius: '10px', padding: '20px', border: '1px solid #2d3748' };
const thStyle = { padding: '15px', textAlign: 'left', color: '#888' };
const tdStyle = { padding: '15px', color: '#eaeaea' };
const loadingStyle = { color: '#eaeaea', fontSize: '18px', textAlign: 'center', padding: '40px' };
const banButtonStyle = { padding: '6px 12px', background: '#ff3366', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' };
const unbanButtonStyle = { padding: '6px 12px', background: '#00ff88', color: '#0f1419', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' };

