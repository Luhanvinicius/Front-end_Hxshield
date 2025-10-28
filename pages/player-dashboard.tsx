import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { API_URL } from '../config';

export default function PlayerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('profile'); // profile, history, nickname, support

  useEffect(() => {
    checkAuth();
  }, []);

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
        
        // Se for Admin ou GM, redireciona para dashboard
        if (parsedUser.role === 'Admin' || parsedUser.role === 'GM') {
          router.push('/dashboard');
        }
      } catch (e) {
        router.push('/');
      }
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
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
            onClick={() => setActiveSection('profile')} 
            style={{...styles.navLink, ...(activeSection === 'profile' ? styles.navLinkActive : {})}}
          >
            Meu Perfil
          </div>
          <div 
            onClick={() => setActiveSection('history')} 
            style={{...styles.navLink, ...(activeSection === 'history' ? styles.navLinkActive : {})}}
          >
            Histórico de Partidas
          </div>
          <div 
            onClick={() => setActiveSection('nickname')} 
            style={{...styles.navLink, ...(activeSection === 'nickname' ? styles.navLinkActive : {})}}
          >
            Solicitar Alteração de Nickname
          </div>
          <div 
            onClick={() => setActiveSection('support')} 
            style={{...styles.navLink, ...(activeSection === 'support' ? styles.navLinkActive : {})}}
          >
            Suporte
          </div>
        </nav>
        <div style={styles.userInfo}>
          <div style={styles.userName}>{user.username}</div>
          <button onClick={handleLogout} style={styles.logoutBtn}>Sair</button>
        </div>
      </div>

      <div style={styles.main}>
        {activeSection === 'profile' && (
          <>
            <h1 style={styles.title}>Meu Perfil</h1>
            
            <div style={styles.infoBox}>
              <h3 style={styles.infoLabel}>Nome Completo</h3>
              <p style={styles.infoValue}>{user.fullName || 'Não informado'}</p>
            </div>

            <div style={styles.infoBox}>
              <h3 style={styles.infoLabel}>Nickname</h3>
              <p style={styles.infoValue}>{user.nickname || 'Não informado'}</p>
            </div>

            <div style={styles.infoBox}>
              <h3 style={styles.infoLabel}>Email</h3>
              <p style={styles.infoValue}>{user.email || 'Não informado'}</p>
            </div>

            <div style={styles.infoBox}>
              <h3 style={styles.infoLabel}>CPF</h3>
              <p style={styles.infoValue}>{user.cpf || 'Não informado'}</p>
            </div>
          </>
        )}

        {activeSection === 'history' && (
          <>
            <h1 style={styles.title}>Histórico de Partidas</h1>
            <div style={styles.infoBox}>
              <p style={styles.infoValue}>Seu histórico de partidas aparecerá aqui em breve.</p>
            </div>
          </>
        )}

        {activeSection === 'nickname' && (
          <>
            <h1 style={styles.title}>Solicitar Alteração de Nickname</h1>
            <div style={styles.infoBox}>
              <h3 style={styles.infoLabel}>Nickname Atual</h3>
              <p style={styles.infoValue}>{user.nickname || 'Não informado'}</p>
              <p style={{...styles.infoValue, fontSize: '14px', color: '#888', marginTop: '20px'}}>
                A funcionalidade de solicitação de alteração de nickname estará disponível em breve.
              </p>
            </div>
          </>
        )}

        {activeSection === 'support' && (
          <>
            <h1 style={styles.title}>Suporte</h1>
            <div style={styles.infoBox}>
              <h3 style={styles.infoLabel}>Entre em Contato</h3>
              <p style={styles.infoValue}>Seção de suporte estará disponível em breve.</p>
              <p style={{...styles.infoValue, fontSize: '14px', color: '#888', marginTop: '20px'}}>
                Em caso de problemas ou dúvidas, entre em contato com o suporte através dos canais oficiais.
              </p>
            </div>
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
    marginBottom: '30px',
  },
  infoBox: {
    background: '#1e2749',
    padding: '20px',
    borderRadius: '10px',
    border: '1px solid #2d3748',
    marginBottom: '20px',
  },
  infoLabel: {
    color: '#888',
    fontSize: '14px',
    marginBottom: '10px',
  },
  infoValue: {
    color: '#eaeaea',
    fontSize: '18px',
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

