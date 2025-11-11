import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { API_URL } from '../config';
import Sidebar from '../components/Sidebar';

function ConfirmModal({ open, onClose, onConfirm, title, message, input, inputValue, onInputChange }: {
  open: boolean, onClose: () => void, onConfirm: () => void, title: string, message: string, input?: boolean, inputValue?: string, onInputChange?: (v: string) => void
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[#1a1a2e] border-2 border-[#8D11ED] rounded-2xl shadow-xl p-8 max-w-xs w-full relative animate-[fadeIn_.25s]">
        <h2 className="text-xl font-bold text-[#8D11ED] text-center mb-3">{title}</h2>
        <p className="text-white text-center mb-7">{message}</p>
        {input && (
          <input
            className="w-full mb-7 p-2 rounded bg-black text-white border border-[#8D11ED] focus:outline-none"
            placeholder="Motivo do banimento"
            value={inputValue}
            onChange={e => onInputChange && onInputChange(e.target.value)}
          />
        )}
        <div className="flex gap-4 justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 cursor-pointer bg-gray-700 text-white rounded-lg font-bold hover:bg-gray-600 focus:outline-none"
          >Cancelar</button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 cursor-pointer bg-[#8D11ED] text-white rounded-lg font-bold hover:bg-[#7a0ed3] focus:outline-none"
            disabled={input && !inputValue}
          >Confirmar</button>
        </div>
      </div>
    </div>
  );
}

export default function Players() {
  const router = useRouter();
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // Modal states
  const [showLogout, setShowLogout] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [banUser, setBanUser] = useState<any>(null);
  const [banReason, setBanReason] = useState("");
  const [showUnbanModal, setShowUnbanModal] = useState(false);
  const [unbanUser, setUnbanUser] = useState<any>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
    loadPlayers();
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

  // Função para formatar CPF
  const formatCPF = (cpf: string | null | undefined): string => {
    if (!cpf) return "Não informado";
    // Remove tudo que não é número
    const numbers = cpf.replace(/\D/g, "");
    if (numbers.length === 0) return "Não informado";
    // Se tiver mais de 11 dígitos, pega apenas os últimos 11
    // Se tiver menos de 11, retorna como está (pode ser incompleto)
    const cpfNumbers = numbers.length > 11 ? numbers.slice(-11) : numbers;
    if (cpfNumbers.length !== 11) return cpf; // Retorna como está se não tiver 11 dígitos
    // Aplica a máscara: 000.000.000-00
    return `${cpfNumbers.slice(0, 3)}.${cpfNumbers.slice(3, 6)}.${cpfNumbers.slice(6, 9)}-${cpfNumbers.slice(9, 11)}`;
  };

  const handleLogout = () => setShowLogout(true);
  const confirmLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  const handleBan = (user: any) => {
    setBanUser(user);
    setBanReason("");
    setShowBanModal(true);
  };
  const confirmBan = async () => {
    if (!banUser || !banReason) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/auth/users/${banUser.id}/ban`, { reason: banReason }, { headers: { Authorization: `Bearer ${token}` } });
      setStatusMsg(`${banUser.username} foi banido!`);
      setShowBanModal(false);
      setTimeout(() => setStatusMsg(null), 2400);
      loadPlayers();
    } catch (error: any) {
      setStatusMsg(error.response?.data?.message || 'Erro ao banir usuário');
      setTimeout(() => setStatusMsg(null), 2400);
    }
  };

  const handleUnban = (user: any) => {
    setUnbanUser(user);
    setShowUnbanModal(true);
  };
  const confirmUnban = async () => {
    if (!unbanUser) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/auth/users/${unbanUser.id}/unban`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setStatusMsg(`${unbanUser.username} foi desbanido!`);
      setShowUnbanModal(false);
      setTimeout(() => setStatusMsg(null), 2400);
      loadPlayers();
    } catch (error: any) {
      setStatusMsg(error.response?.data?.message || 'Erro ao desbanir usuário');
      setTimeout(() => setStatusMsg(null), 2400);
    }
  };

  return (
    <div className="flex min-h-screen bg-black">
      {/* Modais universais */}
      <ConfirmModal
        open={showLogout}
        onClose={() => setShowLogout(false)}
        onConfirm={confirmLogout}
        title="Sair da Plataforma"
        message="Tem certeza que deseja sair da aplicação?"
      />
      <ConfirmModal
        open={showBanModal}
        onClose={() => setShowBanModal(false)}
        onConfirm={confirmBan}
        title={`Banir ${banUser?.username}`}
        message={`Deseja banir o usuário? Informe o motivo abaixo:`}
        input={true}
        inputValue={banReason}
        onInputChange={setBanReason}
      />
      <ConfirmModal
        open={showUnbanModal}
        onClose={() => setShowUnbanModal(false)}
        onConfirm={confirmUnban}
        title={`Desbanir ${unbanUser?.username}`}
        message={`Você tem certeza que deseja desbanir este usuário?`}
      />
      {/* Notificação modal */}
      {statusMsg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-[#1a1a2e] border-2 border-[#8D11ED] z-50 px-8 py-3 rounded-xl shadow-xl text-white font-semibold animate-[fadeIn_.2s]">
          {statusMsg}
        </div>
      )}
      <Sidebar currentPage="players" />
      <main className="flex-1 p-10 overflow-auto">
        <h1 className="text-3xl text-[#eaeaea] font-bold mb-8">Jogadores</h1>
        {loading ? (
          <div className="flex items-center justify-center text-[#eaeaea] text-lg py-12">
            Carregando...
          </div>
        ) : (
          <div className="bg-[#1e2749] rounded-xl p-6 border border-[#2d3748] overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-[#2d3748]">
                  <th className="p-3 text-xs text-gray-400 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="p-3 text-xs text-gray-400 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="p-3 text-xs text-gray-400 uppercase tracking-wider">
                    Nickname
                  </th>
                  <th className="p-3 text-xs text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="p-3 text-xs text-gray-400 uppercase tracking-wider">
                    CPF
                  </th>
                  <th className="p-3 text-xs text-gray-400 uppercase tracking-wider">
                    Cadastrado em
                  </th>
                  <th className="p-3 text-xs text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="p-3 text-xs text-gray-400 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {players.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="text-center py-10 text-lg text-gray-400"
                    >
                      Nenhum jogador encontrado
                    </td>
                  </tr>
                ) : (
                  players.map((player) => (
                    <tr key={player.id} className="border-b border-[#2d3748]">
                      <td className="p-3 text-[#eaeaea]">{player.username}</td>
                      <td className="p-3 text-[#eaeaea]">
                        {player.fullName || "Não informado"}
                      </td>
                      <td className="p-3 text-[#eaeaea]">
                        {player.nickname || "Não informado"}
                      </td>
                      <td className="p-3 text-[#eaeaea]">{player.email}</td>
                      <td className="p-3 text-[#eaeaea]">
                        {formatCPF(player.cpf)}
                      </td>
                      <td className="p-3 text-[#eaeaea]">
                        {formatDate(player.createdAt)}
                      </td>
                      <td
                        className="p-3 font-bold"
                        style={{
                          color: player.isActive ? "#00ff88" : "#ff6b6b",
                        }}
                      >
                        {player.isActive ? "Ativo" : "Inativo"}
                      </td>
                      <td className="p-3">
                        {player.isActive ? (
                          <button
                            onClick={() => handleBan(player)}
                            className="px-3 py-1 bg-[#7a0ed3] cursor-pointer text-white rounded font-bold text-xs hover:bg-[#8D11ED]"
                          >
                            Banir
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnban(player)}
                            className="px-3 py-1 bg-[#7a0ed3] cursor-pointer text-white rounded font-bold text-xs hover:bg-[#8D11ED]"
                          >
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
      </main>
    </div>
  );
}

