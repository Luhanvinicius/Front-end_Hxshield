import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { API_URL } from '../config';

export default function Matches() {
  const router = useRouter();
  const [matches, setMatches] = useState<any[]>([]);
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showGMModal, setShowGMModal] = useState(false);
  const [userRole, setUserRole] = useState<string>('');
  const [formData, setFormData] = useState({ matchId: '', password: '', gameId: 1, gameMaster: 'Admin', description: '' });
  const [gmFormData, setGMFormData] = useState({ username: '', email: '', password: '' });

  useEffect(() => {
    checkAuth();
    loadData();
    
    // Atualiza a cada 3 segundos para mostrar mudanças em tempo real
    const interval = setInterval(() => {
      loadData();
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const checkAuth = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) router.push('/');
      
      // Obter role do usuário do JWT
      try {
        const tokenParts = token.split('.');
        const payload = JSON.parse(atob(tokenParts[1]));
        setUserRole(payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || '');
      } catch (e) {
        console.error('Error parsing token:', e);
      }
    }
  };

  const loadData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [matchesRes, gamesRes] = await Promise.all([
        axios.get(`${API_URL}/match`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/game`)
      ]);
      
      // Carrega jogadores ativos para cada partida
      const matchesWithPlayers = await Promise.all(
        matchesRes.data.map(async (match: any) => {
          try {
            const playersRes = await axios.get(`${API_URL}/match/${match.matchId}/players`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            return {
              ...match,
              players: playersRes.data || [],
              playerCount: Array.isArray(playersRes.data) ? playersRes.data.length : 0
            };
          } catch (error) {
            console.error(`Error loading players for match ${match.matchId}:`, error);
            return { ...match, players: [], playerCount: 0 };
          }
        })
      );
      
      setMatches(matchesWithPlayers);
      setGames(gamesRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/match`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowModal(false);
      loadData();
      setFormData({ matchId: '', password: '', gameId: 1, gameMaster: 'Admin', description: '' });
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erro ao criar partida');
    }
  };

  const createGM = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/auth/register-gm`, gmFormData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowGMModal(false);
      alert('GM cadastrado com sucesso!');
      setGMFormData({ username: '', email: '', password: '' });
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erro ao cadastrar GM');
    }
  };

  const cancelMatch = async (matchId: string) => {
    if (!confirm('Deseja realmente cancelar esta partida?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/match/${matchId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erro ao cancelar partida');
    }
  };

  const finalizeMatch = async (matchId: string) => {
    if (!confirm('Deseja realmente finalizar esta partida?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/match/${matchId}/finalize`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erro ao finalizar partida');
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (match: any) => {
    // Usa o status real da partida (Ativa, Finalizada, Cancelada)
    if (match.status === 'Finalizada') return '#888';
    if (match.status === 'Cancelada') return '#ff6b6b';
    if (match.status === 'Ativa' && match.isMonitoring) return '#00ff88';
    if (match.status === 'Ativa') return '#4a9eff';
    return '#eaeaea';
  };

  const getStatusText = (match: any) => {
    return match.status || 'Ativa';
  };

  return (
    <div style={containerStyle}>
      <div style={sidebarStyle}>
        <h2 style={logoStyle}>BlackSecurity</h2>
        <nav style={navStyle}>
          <a href="/dashboard" style={navLinkStyle}>Dashboard</a>
          <a href="/matches" style={{...navLinkStyle, ...activeLinkStyle}}>Partidas</a>
          <a href="/players" style={navLinkStyle}>Jogadores</a>
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
        <div style={headerStyle}>
          <h1 style={titleStyle}>Partidas</h1>
          <div style={{ display: 'flex', gap: '10px' }}>
            {userRole === 'Admin' && (
              <button onClick={() => setShowGMModal(true)} style={{...buttonStyle, background: '#ff6b6b'}}>
                + Cadastrar GM
              </button>
            )}
            <button onClick={() => setShowModal(true)} style={buttonStyle}>
              + Nova Partida
            </button>
          </div>
        </div>

        {loading ? (
          <div style={loadingStyle}>Carregando...</div>
        ) : (
          <div style={tableStyle}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #2d3748' }}>
                  <th style={thStyle}>ID Partida</th>
                  <th style={thStyle}>Jogo</th>
                  <th style={thStyle}>GM</th>
                  <th style={thStyle}>Descrição</th>
                  <th style={thStyle}>Jogadores</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Criada</th>
                  {(userRole === 'Admin' || userRole === 'GM') && <th style={thStyle}>Ações</th>}
                </tr>
              </thead>
              <tbody>
                {matches.map((match) => (
                  <tr key={match.id} style={{ borderBottom: '1px solid #2d3748' }}>
                    <td style={tdStyle}>{match.matchId}</td>
                    <td style={tdStyle}>{match.game?.name || 'N/A'}</td>
                    <td style={tdStyle}>{match.gameMaster}</td>
                    <td style={tdStyle}>{match.description}</td>
                    <td style={tdStyle}>
                      <span style={{ 
                        color: (match.playerCount || match.players?.length || 0) > 0 ? '#00ff88' : '#888',
                        fontWeight: 'bold'
                      }}>
                        {match.playerCount !== undefined ? match.playerCount : (match.players?.length || 0)}
                      </span>
                    </td>
                    <td style={{...tdStyle, color: getStatusColor(match)}}>
                      {getStatusText(match)}
                    </td>
                    <td style={tdStyle}>{formatDate(match.createdAt)}</td>
                    {(userRole === 'Admin' || userRole === 'GM') && (
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          {match.status === 'Ativa' && (
                            <>
                              <button 
                                onClick={() => finalizeMatch(match.matchId)}
                                style={{...actionBtnStyle, background: '#28a745'}}
                                title="Finalizar Partida"
                              >
                                ✓
                              </button>
                              <button 
                                onClick={() => cancelMatch(match.matchId)}
                                style={{...actionBtnStyle, background: '#dc3545'}}
                                title="Cancelar Partida"
                              >
                                ✕
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div style={modalOverlayStyle} onClick={() => setShowModal(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ color: '#eaeaea', marginBottom: '20px' }}>Criar Nova Partida</h2>
            <form onSubmit={createMatch}>
              <div style={formGroupStyle}>
                <label style={labelStyle}>ID da Partida</label>
                <input
                  type="text"
                  value={formData.matchId}
                  onChange={(e) => setFormData({...formData, matchId: e.target.value})}
                  style={inputStyle}
                  required
                />
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Senha</label>
                <input
                  type="text"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  style={inputStyle}
                  required
                />
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Jogo</label>
                <select
                  value={formData.gameId}
                  onChange={(e) => setFormData({...formData, gameId: parseInt(e.target.value)})}
                  style={inputStyle}
                  required
                >
                  {games.map((game) => (
                    <option key={game.id} value={game.id}>{game.name}</option>
                  ))}
                </select>
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Game Master</label>
                <input
                  type="text"
                  value={formData.gameMaster}
                  onChange={(e) => setFormData({...formData, gameMaster: e.target.value})}
                  style={inputStyle}
                />
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Descrição</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  style={{...inputStyle, minHeight: '60px'}}
                />
              </div>
              <button type="submit" style={buttonStyle}>
                Criar Partida
              </button>
            </form>
          </div>
        </div>
      )}

      {showGMModal && (
        <div style={modalOverlayStyle} onClick={() => setShowGMModal(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ color: '#eaeaea', marginBottom: '20px' }}>Cadastrar Game Master</h2>
            <form onSubmit={createGM}>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Username</label>
                <input
                  type="text"
                  value={gmFormData.username}
                  onChange={(e) => setGMFormData({...gmFormData, username: e.target.value})}
                  style={inputStyle}
                  required
                />
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  value={gmFormData.email}
                  onChange={(e) => setGMFormData({...gmFormData, email: e.target.value})}
                  style={inputStyle}
                  required
                />
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Password</label>
                <input
                  type="password"
                  value={gmFormData.password}
                  onChange={(e) => setGMFormData({...gmFormData, password: e.target.value})}
                  style={inputStyle}
                  required
                />
              </div>
              <button type="submit" style={buttonStyle}>
                Cadastrar GM
              </button>
            </form>
          </div>
        </div>
      )}
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
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' };
const titleStyle = { color: '#eaeaea', fontSize: '32px', fontWeight: 'bold' };
const buttonStyle = { background: '#0f3460', color: '#eaeaea', border: 'none', padding: '12px 24px', borderRadius: '5px', cursor: 'pointer' };
const tableStyle = { background: '#1e2749', borderRadius: '10px', padding: '20px', border: '1px solid #2d3748' };
const thStyle = { padding: '15px', textAlign: 'left', color: '#888' };
const tdStyle = { padding: '15px', color: '#eaeaea' };
const loadingStyle = { color: '#eaeaea', fontSize: '18px', textAlign: 'center', padding: '40px' };
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalStyle = { background: '#1e2749', padding: '40px', borderRadius: '10px', minWidth: '400px' };
const formGroupStyle = { marginBottom: '20px' };
const labelStyle = { display: 'block', color: '#eaeaea', marginBottom: '8px' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #2d3748', background: '#16213e', color: '#eaeaea', boxSizing: 'border-box' };
const actionBtnStyle = { padding: '5px 10px', borderRadius: '5px', border: 'none', color: 'white', cursor: 'pointer', fontSize: '16px' };