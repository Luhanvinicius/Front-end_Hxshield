import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { API_URL } from '../config';
import Sidebar from '../components/Sidebar';

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
        if (parsedUser.role !== 'GM') {
          if (parsedUser.role === 'Admin') router.push('/dashboard');
          else router.push('/player-dashboard');
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
        const response = await axios.get(`${API_URL}/match/user/${user.id}`, { headers: { Authorization: `Bearer ${token}` } });
        setMatches(response.data.created || []);
      } else if (activeSection === 'players') {
        const response = await axios.get(`${API_URL}/player`, { headers: { Authorization: `Bearer ${token}` } });
        const gmMatchIds = matches.map(m => m.id);
        setPlayers(response.data.filter((p: any) => gmMatchIds.includes(p.matchId)));
      }
    } catch (error) {
      // ignore
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Finalizada': return '#888';
      case 'Cancelada': return '#ff6b6b';
      default: return '#4a9eff';
    }
  };

  if (loading || !user) {
    return <div className="flex items-center justify-center min-h-screen text-[#eaeaea] text-lg">Carregando...</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#0f1419] font-sans">
      <Sidebar currentPage="gm-dashboard" />
      <main className="flex-1 p-10 overflow-auto">
        {activeSection === 'matches' && (
          <>
            <h1 className="text-3xl text-[#eaeaea] font-bold mb-2">Minhas Partidas</h1>
            <p className="text-sm text-gray-400 mb-7">Partidas criadas e monitoradas por você</p>
            {matches.length === 0 ? (
              <div className="bg-[#8D11ED] border border-[#2d3748] rounded-xl p-7 mb-7 text-center text-gray-300">
                <p className="text-lg">Você ainda não criou nenhuma partida.</p>
                <a href="/matches" className="inline-block mt-5 px-6 py-3 bg-[#7a0ed3] text-white rounded-lg font-bold hover:bg-[#8D11ED] transition">Criar Partida</a>
              </div>
            ) : (
              <div className="bg-[#8D11ED] border border-[#2d3748] rounded-xl p-7">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-[#2d3748]">
                      <th className="p-3 text-xs text-gray-400 uppercase tracking-wider">ID Partida</th>
                      <th className="p-3 text-xs text-gray-400 uppercase tracking-wider">Jogo</th>
                      <th className="p-3 text-xs text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="p-3 text-xs text-gray-400 uppercase tracking-wider">Jogadores</th>
                      <th className="p-3 text-xs text-gray-400 uppercase tracking-wider">Criada em</th>
                      <th className="p-3 text-xs text-gray-400 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matches.map((match: any) => (
                      <tr key={match.id} className="border-b border-[#2d3748]">
                        <td className="p-3 text-[#eaeaea]">#{match.matchId}</td>
                        <td className="p-3 text-[#eaeaea]">{match.game?.name || 'N/A'}</td>
                        <td className="p-3"><span style={{ color: getStatusColor(match.status) }}>{match.status || 'Ativa'}</span></td>
                        <td className="p-3 text-[#eaeaea]">{match.players?.length || 0}</td>
                        <td className="p-3 text-[#eaeaea]">{new Date(match.createdAt).toLocaleString('pt-BR')}</td>
                        <td className="p-3"><a href="/matches" className="text-[#4a9eff] underline">Ver</a></td>
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
            <h1 className="text-3xl text-[#eaeaea] font-bold mb-2">Jogadores Ativos</h1>
            <p className="text-sm text-gray-400 mb-7">Jogadores nas suas partidas</p>
            {players.length === 0 ? (
              <div className="bg-[#8D11ED] border border-[#2d3748] rounded-xl p-7 text-center text-gray-300">
                Nenhum jogador ativo nas suas partidas no momento.
              </div>
            ) : (
              <div className="bg-[#8D11ED] border border-[#2d3748] rounded-xl p-7">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-[#2d3748]">
                      <th className="p-3 text-xs text-gray-400 uppercase tracking-wider">Username</th>
                      <th className="p-3 text-xs text-gray-400 uppercase tracking-wider">Partida</th>
                      <th className="p-3 text-xs text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="p-3 text-xs text-gray-400 uppercase tracking-wider">Conectado</th>
                      <th className="p-3 text-xs text-gray-400 uppercase tracking-wider">Iniciado</th>
                      <th className="p-3 text-xs text-gray-400 uppercase tracking-wider">Finalizado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {players.map((player: any) => (
                      <tr key={player.id} className="border-b border-[#2d3748]">
                        <td className="p-3 text-[#eaeaea]">{player.username}</td>
                        <td className="p-3 text-[#eaeaea]">#{player.match?.matchId || 'N/A'}</td>
                        <td className="p-3"><span style={{ color: player.finishedAt ? '#888' : player.startedAt ? '#00ff88' : '#4a9eff' }}>{player.finishedAt ? 'Finalizado' : player.startedAt ? 'Monitorando' : 'Conectado'}</span></td>
                        <td className="p-3 text-[#eaeaea]">{player.connectedAt ? new Date(player.connectedAt).toLocaleString('pt-BR') : 'N/A'}</td>
                        <td className="p-3 text-[#eaeaea]">{player.startedAt ? new Date(player.startedAt).toLocaleString('pt-BR') : '-'}</td>
                        <td className="p-3 text-[#eaeaea]">{player.finishedAt ? new Date(player.finishedAt).toLocaleString('pt-BR') : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

