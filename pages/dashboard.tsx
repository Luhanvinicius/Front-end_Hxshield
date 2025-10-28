import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { API_URL } from '../config';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    loadStats();
  }, []);

  const checkAuth = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (!token) {
        router.push('/');
        return;
      }

      setUser(JSON.parse(userData || '{}'));
    }
  };

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const [licenses, clients, detections] = await Promise.all([
        axios.get(`${API_URL}/license`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/client`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/detection`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/match/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setStats({
        totalLicenses: licenses.data.length,
        activeLicenses: licenses.data.filter((l: any) => l.isActive).length,
        totalClients: clients.data.length,
        bannedClients: clients.data.filter((c: any) => c.isBanned).length,
        totalDetections: detections.data.length,
        unresolvedDetections: detections.data.filter((d: any) => !d.isResolved).length,
        activePlayers: matchStats.data.activePlayers || 0,
        totalPlayers: matchStats.data.totalPlayers || 0,
        activeMatches: matchStats.data.activeMatches || 0,
        finishedMatches: matchStats.data.finishedMatches || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading) {
    return <div style={styles.loading}>Carregando...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>BlackSecurity</h2>
        <nav style={styles.nav}>
          <a href="/dashboard" style={{...styles.navLink, ...styles.navLinkActive}}>
            Dashboard
          </a>
          <a href="/matches" style={styles.navLink}>Partidas</a>
          <a href="/players" style={styles.navLink}>Jogadores</a>
          <a href="/gm-register" style={styles.navLink}>Cadastro de GM</a>
          <a href="/licenses" style={styles.navLink}>Licenças</a>
          <a href="/clients" style={styles.navLink}>Clientes</a>
          <a href="/banned" style={styles.navLink}>Lista de Banidos</a>
          <a href="/detections" style={styles.navLink}>Detecções</a>
        </nav>
        <div style={styles.userInfo}>
          <div>{user?.username}</div>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Sair
          </button>
        </div>
      </div>

      <div style={styles.main}>
        <h1 style={styles.title}>Dashboard</h1>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <h3 style={styles.statLabel}>Total de Licenças</h3>
            <p style={styles.statValue}>{stats.totalLicenses || 0}</p>
          </div>

          <div style={styles.statCard}>
            <h3 style={styles.statLabel}>Licenças Ativas</h3>
            <p style={styles.statValue}>{stats.activeLicenses || 0}</p>
          </div>

          <div style={styles.statCard}>
            <h3 style={styles.statLabel}>Total de Clientes</h3>
            <p style={styles.statValue}>{stats.totalClients || 0}</p>
          </div>

          <div style={styles.statCard}>
            <h3 style={styles.statLabel}>Clientes Banidos</h3>
            <p style={styles.statValue}>{stats.bannedClients || 0}</p>
          </div>

          <div style={styles.statCard}>
            <h3 style={styles.statLabel}>Total de Detecções</h3>
            <p style={styles.statValue}>{stats.totalDetections || 0}</p>
          </div>

          <div style={styles.statCard}>
            <h3 style={styles.statLabel}>Detecções Pendentes</h3>
            <p style={styles.statValue}>{stats.unresolvedDetections || 0}</p>
          </div>

          <div style={styles.statCard}>
            <h3 style={styles.statLabel}>Jogadores Ativos</h3>
            <p style={styles.statValue}>{stats.activePlayers || 0}</p>
          </div>

          <div style={styles.statCard}>
            <h3 style={styles.statLabel}>Total de Jogadores</h3>
            <p style={styles.statValue}>{stats.totalPlayers || 0}</p>
          </div>

          <div style={styles.statCard}>
            <h3 style={styles.statLabel}>Salas Ativas</h3>
            <p style={styles.statValue}>{stats.activeMatches || 0}</p>
          </div>

          <div style={styles.statCard}>
            <h3 style={styles.statLabel}>Salas Encerradas</h3>
            <p style={styles.statValue}>{stats.finishedMatches || 0}</p>
          </div>
        </div>
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
  },
  navLink: {
    color: '#888',
    textDecoration: 'none',
    padding: '12px',
    borderRadius: '5px',
    transition: 'all 0.3s',
  },
  navLinkActive: {
    background: '#0f3460',
    color: '#eaeaea',
  },
  userInfo: {
    marginTop: 'auto',
    paddingTop: '20px',
    borderTop: '1px solid #16213e',
  },
  logoutBtn: {
    width: '100%',
    padding: '10px',
    background: '#ff3366',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  main: {
    flex: 1,
    padding: '40px',
    overflow: 'auto',
  },
  title: {
    color: '#eaeaea',
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '30px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
  },
  statCard: {
    background: '#1e2749',
    padding: '30px',
    borderRadius: '10px',
    border: '1px solid #2d3748',
  },
  statLabel: {
    color: '#888',
    fontSize: '14px',
    marginBottom: '10px',
  },
  statValue: {
    color: '#eaeaea',
    fontSize: '36px',
    fontWeight: 'bold',
    margin: 0,
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

