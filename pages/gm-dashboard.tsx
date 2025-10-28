import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { API_URL } from '../config';

export default function GMDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [activeSection, setActiveSection] = useState('matches');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      loadData();
      const interval = setInterval(() => {
        loadData();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [user, activeSection]);

  const checkAuth = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (!token || !userData) {
        router.push('/');
        return;
      }

      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        // Se NÃO for GM, redireciona
        if (parsedUser.role !== 'GM') {
          if (parsedUser.role === 'Admin') {
            router.push('/dashboard');
          } else {
            router.push('/player-dashboard');
          }
        }
      } catch (e) {
        router.push('/');
      }
    }
    setLoading(false);
  };

  const loadData = async () => {
    if (!user) return;
    
    try {
      const token = localStorage.getItem('token');
      
      if (activeSection === 'matches') {
        // Buscar partidas criadas pelo GM
        const response = await axios.get(`${API_URL}/match/user/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMatches(response.data.created || []);
      } else if (activeSection === 'players') {
        // Buscar todos os jogadores das partidas do GM
        const response = await axios.get(`${API_URL}/player`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Filtrar apenas jogadores das partidas criadas por este GM
        const gmMatchIds = matches.map(m => m.id);
        const filtered = response.data.filter((p: any) => gmMatchIds.includes(p.matchId));
        setPlayers(filtered);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Finalizada': return '#888';
      case 'Cancelada': return '#ff6b6b';
      default: return '#4a9eff';
    }
  };

  if (loading || !user) {
    return <div style={styles.loading}>Carregando...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>BlackSecurity</h2>
        <nav style={styles.nav}>
          <div 
            onClick={() => setActiveSection('matches')} 
            style={{...styles.navLink, ...(activeSection === 'matches' ? styles.navLinkActive : {})}}
          >
            Minhas Partidas
          </div>
          <div 
            onClick={() => setActiveSection('players')} 
            style={{...styles.navLink, ...(activeSection === 'players' ? styles.navLinkActive : {})}}
          >
            Jogadores Ativos
          </div>
        </nav>
        <div style={styles.userInfo}>
          <div style={styles.userName}>{user.username}</div>
          <button onClick={handleLogout} style={styles.logoutBtn}>Sair</button>
        </div>
      </div>

      <div style={styles.main}>
        {activeSection === 'matches' && (
          <>
            <h1 style={styles.title}>Minhas Partidas</h1>
            <p style={styles.subtitle}>Partidas criadas e monitoradas por você</p>
            
            {matches.length === 0 ? (
              <div style={styles.emptyState}>
                <p>Você ainda não criou nenhuma partida.</p>
                <a href="/matches" style={styles.link}>Criar Partida</a>
              </div>
            ) : (
              <div style={styles.tableStyle}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #2d3748' }}>
                      <th style={styles.thStyle}>ID Partida</th>
                      <th style={styles.thStyle}>Jogo</th>
                      <th style={styles.thStyle}>Status</th>
                      <th style={styles.thStyle}>Jogadores</th>
                      <th style={styles.thStyle}>Criada em</th>
                      <th style={styles.thStyle}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matches.map((match) => (
                      <tr key={match.id} style={{ borderBottom: '1px solid #2d3748' }}>
                        <td style={styles.tdStyle}>#{match.matchId}</td>
                        <td style={styles.tdStyle}>{match.game?.name || 'N/A'}</td>
                        <td style={styles.tdStyle}>
                          <span style={{ color: getStatusColor(match.status) }}>
                            {match.status || 'Ativa'}
                          </span>
                        </td>
                        <td style={styles.tdStyle}>{match.players?.length || 0}</td>
                        <td style={styles.tdStyle}>{new Date(match.createdAt).toLocaleString('pt-BR')}</td>
                        <td style={styles.tdStyle}>
                          <a href="/matches" style={styles.actionLink}>Ver</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {activeSection === 'players' && (
          <>
            <h1 style={styles.title}>Jogadores Ativos</h1>
            <p style={styles.subtitle}>Jogadores nas suas partidas</p>
            
            {players.length === 0 ? (
              <div style={styles.emptyState}>
                Nenhum jogador ativo nas suas partidas no momento.
              </div>
            ) : (
              <div style={styles.tableStyle}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #2d3748' }}>
                      <th style={styles.thStyle}>Username</th>
                      <th style={styles.thStyle}>Partida</th>
                      <th style={styles.thStyle}>Status</th>
                      <th style={styles.thStyle}>Conectado</th>
                      <th style={styles.thStyle}>Iniciado</th>
                      <th style={styles.thStyle}>Finalizado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {players.map((player) => (
                      <tr key={player.id} style={{ borderBottom: '1px solid #2d3748' }}>
                        <td style={styles.tdStyle}>{player.username}</td>
                        <td style={styles.tdStyle}>#{player.match?.matchId || 'N/A'}</td>
                        <td style={styles.tdStyle}>
                          <span style={{ 
                            color: player.finishedAt ? '#888' : 
                                   player.startedAt ? '#00ff88' : '#4a9eff'
                          }}>
                            {player.finishedAt ? 'Finalizado' : 
                             player.startedAt ? 'Monitorando' : 'Conectado'}
                          </span>
                        </td>
                        <td style={styles.tdStyle}>{player.connectedAt ? new Date(player.connectedAt).toLocaleString('pt-BR') : 'N/A'}</td>
                        <td style={styles.tdStyle}>{player.startedAt ? new Date(player.startedAt).toLocaleString('pt-BR') : '-'}</td>
                        <td style={styles.tdStyle}>{player.finishedAt ? new Date(player.finishedAt).toLocaleString('pt-BR') : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const styles: any = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    background: '#0f1419',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  sidebar: {
    width: '250px',
    background: '#1a1a2e',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid #16213e',
  },
  logo: {
    color: '#eaeaea',
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '30px',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    flex: 1,
  },
  navLink: {
    color: '#888',
    padding: '12px',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  navLinkActive: {
    background: '#0f3460',
    color: '#eaeaea',
  },
  userInfo: {
    marginTop: 'auto',
    borderTop: '1px solid #16213e',
    paddingTop: '20px',
  },
  userName: {
    color: '#eaeaea',
    marginBottom: '10px',
  },
  logoutBtn: {
    width: '100%',
    padding: '10px',
    background: '#ff3366',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  main: {
    flex: 1,
    padding: '40px',
  },
  title: {
    color: '#eaeaea',
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  subtitle: {
    color: '#888',
    fontSize: '14px',
    marginBottom: '30px',
  },
  tableStyle: {
    background: '#1e2749',
    borderRadius: '10px',
    padding: '20px',
    border: '1px solid #2d3748',
  },
  thStyle: {
    padding: '15px',
    textAlign: 'left',
    color: '#888',
  },
  tdStyle: {
    padding: '15px',
    color: '#eaeaea',
  },
  emptyState: {
    background: '#1e2749',
    borderRadius: '10px',
    padding: '40px',
    textAlign: 'center',
    color: '#888',
    border: '1px solid #2d3748',
  },
  link: {
    display: 'inline-block',
    marginTop: '20px',
    padding: '12px 24px',
    background: '#0f3460',
    color: '#eaeaea',
    textDecoration: 'none',
    borderRadius: '5px',
  },
  actionLink: {
    color: '#4a9eff',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    color: '#eaeaea',
    fontSize: '18px',
  },
};

