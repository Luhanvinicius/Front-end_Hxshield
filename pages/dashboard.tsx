import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { API_URL } from '../config';
import Sidebar from '../components/Sidebar';
import Image from 'next/image';

function ConfirmModal({ open, onClose, onConfirm, title, message }: { open: boolean, onClose: () => void, onConfirm: () => void, title: string, message: string }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[#1a1a2e] border-2 border-[#8D11ED] rounded-2xl shadow-xl p-8 max-w-xs w-full relative animate-[fadeIn_.25s]">
        <h2 className="text-xl font-bold text-[#8D11ED] text-center mb-3">{title}</h2>
        <p className="text-white text-center mb-7">{message}</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-700 text-white rounded-lg font-bold hover:bg-gray-600 focus:outline-none"
          >Cancelar</button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-[#8D11ED] text-white rounded-lg font-bold hover:bg-[#7a0ed3] focus:outline-none"
          >Confirmar</button>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const logo = [{ image: "/logohx.png", alt: "logo" }];
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
      const [licenses, clients, detections, matchStats] = await Promise.all([
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
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-gray-200 text-lg">Carregando...</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#0f1419] font-sans">
      <ConfirmModal
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
        title="Sair do Sistema"
        message="Tem certeza que deseja sair? Deseja realmente finalizar sua sessão?"
      />
      <Sidebar currentPage="dashboard" />
      <main className="flex-1 p-10 overflow-auto">
        <h1 className="text-3xl text-[#eaeaea] font-bold mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          <DashboardStat
            label="Total de Licenças"
            value={stats.totalLicenses || 0}
          />
          <DashboardStat
            label="Licenças Ativas"
            value={stats.activeLicenses || 0}
          />
          <DashboardStat
            label="Total de Clientes"
            value={stats.totalClients || 0}
          />
          <DashboardStat
            label="Clientes Banidos"
            value={stats.bannedClients || 0}
          />
          <DashboardStat
            label="Total de Detecções"
            value={stats.totalDetections || 0}
          />
          <DashboardStat
            label="Detecções Pendentes"
            value={stats.unresolvedDetections || 0}
          />
          <DashboardStat
            label="Usuários Ativos"
            value={stats.activePlayers || 0}
          />
          <DashboardStat
            label="Total de usuários"
            value={stats.totalPlayers || 0}
          />
          <DashboardStat
            label="Salas Ativas"
            value={stats.activeMatches || 0}
          />
          <DashboardStat
            label="Salas Encerradas"
            value={stats.finishedMatches || 0}
          />
        </div>
      </main>
    </div>
  );
}

function DashboardStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-[#2d3748] p-8 rounded-xl border border-[#2d3748] flex flex-col items-center shadow">
      <h3 className="text-gray-400 text-sm mb-2 font-semibold">{label}</h3>
      <p className="text-[#eaeaea] text-3xl font-bold m-0">{value}</p>
    </div>
  );
}

