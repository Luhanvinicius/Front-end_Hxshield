import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { API_URL } from '../config';

export default function Licenses() {
  const router = useRouter();
  const [licenses, setLicenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ daysValid: 30, maxDevices: 1 });

  useEffect(() => {
    checkAuth();
    loadLicenses();
  }, []);

  const checkAuth = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) router.push('/');
    }
  };

  const loadLicenses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/license`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLicenses(response.data);
    } catch (error) {
      console.error('Error loading licenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const createLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/license`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowModal(false);
      loadLicenses();
      setFormData({ daysValid: 30, maxDevices: 1 });
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erro ao criar licença');
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (license: any) => {
    if (!license.isActive) return '#888';
    if (new Date(license.expiresAt) < new Date()) return '#ff3366';
    return '#00ff88';
  };

  return (
    <div style={containerStyle}>
      <div style={sidebarStyle}>
        <h2 style={logoStyle}>BlackSecurity</h2>
        <nav style={navStyle}>
          <a href="/dashboard" style={navLinkStyle}>Dashboard</a>
          <a href="/matches" style={navLinkStyle}>Partidas</a>
          <a href="/players" style={navLinkStyle}>Jogadores</a>
          <a href="/gm-register" style={navLinkStyle}>Cadastro de GM</a>
          <a href="/licenses" style={{...navLinkStyle, ...activeLinkStyle}}>Licenças</a>
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
        <div style={headerStyle}>
          <h1 style={titleStyle}>Licenças</h1>
          <button onClick={() => setShowModal(true)} style={buttonStyle}>
            + Nova Licença
          </button>
        </div>

        {loading ? (
          <div style={loadingStyle}>Carregando...</div>
        ) : (
          <div style={tableStyle}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #2d3748' }}>
                  <th style={thStyle}>Chave</th>
                  <th style={thStyle}>Criada em</th>
                  <th style={thStyle}>Expira em</th>
                  <th style={thStyle}>Status</th>
                </tr>
              </thead>
              <tbody>
                {licenses.map((license) => (
                  <tr key={license.id} style={{ borderBottom: '1px solid #2d3748' }}>
                    <td style={tdStyle}>{license.key}</td>
                    <td style={tdStyle}>{formatDate(license.createdAt)}</td>
                    <td style={tdStyle}>{formatDate(license.expiresAt)}</td>
                    <td style={{...tdStyle, color: getStatusColor(license)}}>
                      {license.isActive ? 'Ativa' : 'Inativa'}
                    </td>
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
            <h2 style={{ color: '#eaeaea', marginBottom: '20px' }}>Criar Nova Licença</h2>
            <form onSubmit={createLicense}>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Dias Válidos</label>
                <input
                  type="number"
                  value={formData.daysValid}
                  onChange={(e) => setFormData({...formData, daysValid: parseInt(e.target.value)})}
                  style={inputStyle}
                  required
                />
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Máximo de Dispositivos</label>
                <input
                  type="number"
                  value={formData.maxDevices}
                  onChange={(e) => setFormData({...formData, maxDevices: parseInt(e.target.value)})}
                  style={inputStyle}
                  required
                />
              </div>
              <button type="submit" style={buttonStyle}>
                Criar Licença
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
