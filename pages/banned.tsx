import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { API_URL } from "../config";
import Sidebar from "../components/Sidebar";

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

export default function BannedList() {
  const router = useRouter();
  const [bannedUsers, setBannedUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLogout, setShowLogout] = useState(false);
  const [showUnbanModal, setShowUnbanModal] = useState(false);
  const [unbanUserId, setUnbanUserId] = useState<number|null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
    loadBannedUsers();
    const interval = setInterval(() => loadBannedUsers(), 3000);
    return () => clearInterval(interval);
  }, []);

  const checkAuth = () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) router.push("/");
    }
  };

  const loadBannedUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/auth/users/banned`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBannedUsers(response.data);
    } catch (error: any) {
      console.error(
        "Error loading banned users:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("pt-BR");
  };

  const getBanTypeColor = (banType: string) => {
    if (banType === "Automatic") return "#ff4444";
    if (banType === "Manual") return "#ffaa00";
    if (banType === "Web") return "#44aaff";
    return "#888";
  };

  const handleLogout = () => setShowLogout(true);
  const confirmLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  const handleUnban = (userId: number) => {
    setUnbanUserId(userId);
    setShowUnbanModal(true);
  };
  const confirmUnban = async () => {
    if (!unbanUserId) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/auth/users/${unbanUserId}/unban`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStatusMsg(`Usuário desbanido com sucesso!`);
      setShowUnbanModal(false);
      setTimeout(() => setStatusMsg(null), 2400);
      loadBannedUsers();
    } catch (error: any) {
      setStatusMsg(error.response?.data?.message || "Erro ao desbanir usuário");
      setTimeout(() => setStatusMsg(null), 2400);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0f1419]">
      <ConfirmModal
        open={showLogout}
        onClose={() => setShowLogout(false)}
        onConfirm={confirmLogout}
        title="Sair da Plataforma"
        message="Tem certeza que deseja sair da aplicação?"
      />
      <ConfirmModal
        open={showUnbanModal}
        onClose={() => setShowUnbanModal(false)}
        onConfirm={confirmUnban}
        title={`Desbanir Usuário`}
        message={`Você tem certeza que deseja desbanir este usuário?`}
      />
      {statusMsg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-[#1a1a2e] border-2 border-[#8D11ED] z-50 px-8 py-3 rounded-xl shadow-xl text-white font-semibold animate-[fadeIn_.2s]">
          {statusMsg}
        </div>
      )}
      <Sidebar currentPage="banned" />
      <main className="flex-1 p-10 overflow-auto">
        <h1 className="text-3xl text-[#eaeaea] font-bold mb-8">
          Lista de Banidos
        </h1>
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
                    Usuario
                  </th>
                  <th className="p-3 text-xs text-gray-400 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="p-3 text-xs text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="p-3 text-xs text-gray-400 uppercase tracking-wider">
                    Motivo
                  </th>
                  <th className="p-3 text-xs text-gray-400 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="p-3 text-xs text-gray-400 uppercase tracking-wider">
                    Prova
                  </th>
                  <th className="p-3 text-xs text-gray-400 uppercase tracking-wider">
                    Banido em
                  </th>
                  <th className="p-3 text-xs text-gray-400 uppercase tracking-wider">
                    Expira em
                  </th>
                  <th className="p-3 text-xs text-gray-400 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {bannedUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="text-center py-10 text-lg text-gray-400"
                    >
                      Nenhum usuário banido encontrado
                    </td>
                  </tr>
                ) : (
                  bannedUsers.map((banned) => (
                    <tr key={banned.id} className="border-b border-[#2d3748]">
                      <td className="p-3 text-[#eaeaea]">{banned.username}</td>
                      <td className="p-3 text-[#eaeaea]">
                        {banned.fullName || "N/A"}
                      </td>
                      <td className="p-3 text-[#eaeaea]">{banned.email}</td>
                      <td className="p-3 text-[#eaeaea]">
                        {banned.banReason || "N/A"}
                      </td>
                      <td
                        className="p-3 font-bold"
                        style={{ color: getBanTypeColor(banned.banType) }}
                      >
                        {banned.banType}
                      </td>
                      <td className="p-3 text-[#eaeaea]">
                        {banned.banProof || "N/A"}
                      </td>
                      <td className="p-3 text-[#eaeaea]">
                        {formatDate(banned.bannedAt)}
                      </td>
                      <td className="p-3 text-[#eaeaea]">
                        {banned.banExpiresAt
                          ? formatDate(banned.banExpiresAt)
                          : "Permanente"}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleUnban(banned.id)}
                          className="px-3 py-1 cursor-pointer bg-[#7a0ed3] text-white rounded shadow-sm font-bold text-xs hover:bg-[#8D11ED]"
                        >
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
      </main>
      {/* Notificação status */}
      {statusMsg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-[#1a1a2e] border-2 border-[#8D11ED] z-50 px-8 py-3 rounded-xl shadow-xl text-white font-semibold animate-[fadeIn_.2s]">
          {statusMsg}
        </div>
      )}
    </div>
  );
}
