import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { API_URL } from "../config";
import Sidebar from "../components/Sidebar";

function Modal({ open, onClose, children }: any) {
  if (!open) return null;
  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="bg-[#1a1a2e] border-2 border-[#8D11ED] rounded-2xl shadow-xl p-8 min-w-[340px] max-w-[90vw] text-white animate-[fadeIn_.2s]" onClick={e=>e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export default function Matches() {
  const router = useRouter();
  const [matches, setMatches] = useState<any[]>([]);
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showGMModal, setShowGMModal] = useState(false);
  const [userRole, setUserRole] = useState<string>("");
  const [formData, setFormData] = useState({ matchId: "", password: "", gameId: 1, gameMaster: "Admin", description: "" });
  const [gmFormData, setGMFormData] = useState({ username: "", email: "", password: "" });
  const [modalMsg, setModalMsg] = useState("");
  const [confirmType, setConfirmType] = useState<null | { matchId: string }>();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);

  // Função para gerar ID único de 6 dígitos
  const generateMatchId = () => {
    const id = Math.floor(100000 + Math.random() * 900000).toString();
    setFormData({ ...formData, matchId: id });
  };

  // Função para gerar senha única de 6 dígitos
  const generatePassword = () => {
    const password = Math.floor(100000 + Math.random() * 900000).toString();
    setFormData({ ...formData, password: password });
  };

  // Função para gerar ambos (ID e senha) ao mesmo tempo
  const generateBoth = () => {
    const id = Math.floor(100000 + Math.random() * 900000).toString();
    const password = Math.floor(100000 + Math.random() * 900000).toString();
    setFormData({ ...formData, matchId: id, password: password });
  };

  useEffect(() => { checkAuth(); loadData(); const interval = setInterval(() => { loadData(); }, 3000); return () => clearInterval(interval); }, []);

  const checkAuth = () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token") || '';
      if (!token) router.push("/");
      try {
        const tokenParts = token.split(".");
        const payload = JSON.parse(atob(tokenParts[1]));
        const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || 
                    payload["role"] || 
                    payload["Role"] || 
                    "";
        console.log("Detected role in matches:", role);
        setUserRole(role);
      } catch (e) {
        console.error("Error parsing token in matches:", e);
      }
    }
  };

  const loadData = async () => {
    try {
      const token = localStorage.getItem("token") || '';
      const [matchesRes, gamesRes] = await Promise.all([
        axios.get(`${API_URL}/match`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/game`),
      ]);
      const matchesWithPlayers = await Promise.all(
        matchesRes.data.map(async (match: any) => {
          try {
            const playersRes = await axios.get(
              `${API_URL}/match/${match.matchId}/players`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            return {
              ...match,
              players: playersRes.data || [],
              playerCount: Array.isArray(playersRes.data)
                ? playersRes.data.length
                : 0,
            };
          } catch (error) {
            return { ...match, players: [], playerCount: 0 };
          }
        })
      );
      setMatches(matchesWithPlayers);
      setGames(gamesRes.data);
    } catch (error) {}
    setLoading(false);
  };

  const createMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token") || '';
      await axios.post(`${API_URL}/match`, formData, { headers: { Authorization: `Bearer ${token}` } });
      setShowModal(false);
      loadData();
      setFormData({ matchId: "", password: "", gameId: 1, gameMaster: "Admin", description: "" });
      setModalMsg("Partida criada com sucesso!");
      setTimeout(() => setModalMsg("") , 2000);
    } catch (error: any) {
      setModalMsg(error.response?.data?.message || "Erro ao criar partida");
      setTimeout(() => setModalMsg("") , 2000);
    }
  };

  const createGM = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token") || '';
      await axios.post(`${API_URL}/auth/register-gm`, gmFormData, { headers: { Authorization: `Bearer ${token}` } });
      setShowGMModal(false);
      setModalMsg("GM cadastrado com sucesso!");
      setGMFormData({ username: "", email: "", password: "" });
      setTimeout(() => setModalMsg("") , 2000);
    } catch (error: any) {
      setModalMsg(error.response?.data?.message || "Erro ao cadastrar GM");
      setTimeout(() => setModalMsg("") , 2000);
    }
  };

  const finalizeMatch = (matchId: string) =>
    setConfirmType({ matchId });

  // Função para abrir modal de deletar partida
  const openDeleteModal = (match: any) => {
    setSelectedMatch(match);
    setShowDeleteModal(true);
  };

  // Função para deletar partida
  const deleteMatch = async () => {
    if (!selectedMatch) return;
    try {
      const token = localStorage.getItem("token") || '';
      await axios.post(`${API_URL}/match/${selectedMatch.matchId}/delete`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setModalMsg(`Partida ${selectedMatch.matchId} deletada com sucesso!`);
      setShowDeleteModal(false);
      loadData();
    } catch (error: any) {
      setModalMsg(error.response?.data?.message || "Erro ao deletar partida");
    } finally {
      setTimeout(() => setModalMsg(""), 2500);
    }
  };

  const handleConfirmModal = async () => {
    if (!confirmType) return;
    const { matchId } = confirmType;
    try {
      const token = localStorage.getItem("token") || '';
      await axios.post(`${API_URL}/match/${matchId}/finalize`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setModalMsg("Partida finalizada com sucesso!");
      loadData();
    } catch (error: any) {
      setModalMsg(error.response?.data?.message || "Erro ao finalizar partida");
    } finally {
      setConfirmType(null);
      setTimeout(() => setModalMsg("") , 2500);
    }
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString("pt-BR");
  const getStatusColor = (match: any) => {
    if (match.status === "Finalizada") return '#888';
    if (match.status === "Cancelada") return '#ff3366';
    if (match.status === "Ativa" && match.isMonitoring) return '#00ff88';
    if (match.status === "Ativa") return '#4a9eff';
    return '#eaeaea';
  };
  const getStatusText = (match: any) => match.status || "Ativa";

  return (
    <div className="flex min-h-screen bg-[#0f1419]">
      <Modal open={!!modalMsg} onClose={() => setModalMsg("")}>
        <span>{modalMsg}</span>
      </Modal>
      <Modal open={!!confirmType} onClose={() => setConfirmType(null)}>
        <h3 className="text-lg font-bold text-[#8D11ED] mb-4 text-center">
          Finalizar partida
        </h3>
        <p className="text-white text-center mb-7">
          Deseja realmente finalizar esta partida?
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setConfirmType(null)}
            className="px-6 py-2 bg-gray-700 text-white rounded-lg font-bold hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmModal}
            className="px-6 py-2 bg-[#8D11ED] text-white rounded-lg font-bold hover:bg-[#7a0ed3]"
          >
            Confirmar
          </button>
        </div>
      </Modal>

      {/* Modal de deletar partida */}
      <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <h3 className="text-lg font-bold text-[#ff3366] mb-4 text-center">
          Deletar Partida
        </h3>
        <p className="text-white text-center mb-7">
          Tem certeza que deseja deletar a partida{" "}
          <strong>{selectedMatch?.matchId}</strong>?
          <br />
          <span className="text-red-400 text-sm">
            Esta ação não pode ser desfeita!
          </span>
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="px-6 py-2 bg-gray-700 text-white rounded-lg font-bold hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            onClick={deleteMatch}
            className="px-6 py-2 bg-[#ff3366] text-white rounded-lg font-bold hover:bg-[#ff4a80]"
          >
            Deletar
          </button>
        </div>
      </Modal>

      <Sidebar currentPage="matches" />
      <main className="flex-1 p-10 overflow-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl text-[#eaeaea] font-bold">Partidas</h1>
            {/* Debug temporário
            <div className="text-sm text-yellow-400 mt-2">
              Debug - Role detectado: {userRole || "Nenhum"} | Admin:{" "}
              {userRole === "Admin" ? "Sim" : "Não"} | GM:{" "}
              {userRole === "GM" ? "Sim" : "Não"}
            </div> */}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowModal(true)}
              className="bg-[#7a0ed3] cursor-pointer text-white rounded px-6 py-3 text-base font-bold hover:bg-[#8D11ED] transition-colors"
            >
              + Nova Partida
            </button>
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center text-[#eaeaea] text-lg py-12">
            Carregando...
          </div>
        ) : (
          <div className="bg-[#1e2749] rounded-xl p-4 md:p-6 border border-[#2d3748] overflow-x-auto">
            <table className="w-full border-collapse text-left min-w-[800px]">
              <thead>
                <tr className="border-b border-[#2d3748]">
                  <th className="p-3 text-xs text-gray-400 uppercase tracking-normal">
                    ID Partida
                  </th>
                  <th className="p-3 text-xs text-gray-400 uppercase tracking-wider">
                    Jogo
                  </th>
                  <th className="p-3 text-xs text-gray-400 uppercase tracking-wider">
                    GM
                  </th>
                  <th className="p-3 text-xs text-gray-400 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="p-3 text-xs text-gray-400 uppercase tracking-wider">
                    Jogadores
                  </th>
                  <th className="p-3 text-xs text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="p-3 text-xs text-gray-400 uppercase tracking-wider">
                    Criada
                  </th>
                  {(userRole === "Admin" || userRole === "GM") && (
                    <th className="p-2 text-xs text-gray-400 uppercase tracking-wide text-center">
                      Ações
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {matches.map((match) => (
                  <tr key={match.id} className="border-b border-[#2d3748]">
                    <td className="p-3 text-[#eaeaea]">{match.matchId}</td>
                    <td className="p-3 text-[#eaeaea]">
                      {match.game?.name || "N/A"}
                    </td>
                    <td className="p-3 text-[#eaeaea]">{match.gameMaster}</td>
                    <td className="p-3 text-[#eaeaea]">{match.description}</td>
                    <td
                      className="p-3 font-bold"
                      style={{
                        color:
                          (match.playerCount || match.players?.length || 0) > 0
                            ? "#00ff88"
                            : "#888",
                      }}
                    >
                      {match.playerCount !== undefined
                        ? match.playerCount
                        : match.players?.length || 0}
                    </td>
                    <td
                      className="p-3 font-bold"
                      style={{ color: getStatusColor(match) }}
                    >
                      {getStatusText(match)}
                    </td>
                    <td className="p-3 text-[#eaeaea]">
                      {formatDate(match.createdAt)}
                    </td>
                    {(userRole === "Admin" || userRole === "GM") && (
                      <td className="p-2">
                        <div className="flex flex-row gap-1 items-start justify-center">
                          {/* Botão de finalizar para partidas ativas */}
                          {match.status === "Ativa" && (
                            <button
                              title="Finalizar Partida"
                              onClick={() => finalizeMatch(match.matchId)}
                              className="px-2 py-1 text-xs rounded cursor-pointer bg-green-600 font-bold text-white hover:bg-green-700 transition-colors mb-1"
                            >
                              <svg
                                className="w-3 h-3 inline mr-1 "
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>{" "}
                              Finalizar
                            </button>
                          )}

                          {/* Botão de deletar */}
                          <button
                            title="Deletar Partida"
                            onClick={() => openDeleteModal(match)}
                            className="px-2 py-1 text-xs rounded cursor-pointer bg-red-600 font-bold text-white hover:bg-red-700 transition-colors"
                          >
                            <svg
                              className="w-3 h-3 inline mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"
                                clipRule="evenodd"
                              />
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>{" "}
                            Deletar
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Modal open={showModal} onClose={() => setShowModal(false)}>
          <h2 className="text-xl font-bold text-[#8D11ED] mb-5 min-w-xl">
            Criar Nova Partida
          </h2>
          <form onSubmit={createMatch}>
            <div className="mb-5">
              <label className="block text-[#eaeaea] mb-2 font-semibold">
                ID da Partida
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.matchId}
                  onChange={(e) =>
                    setFormData({ ...formData, matchId: e.target.value })
                  }
                  className="flex-1 p-3 rounded border border-[#8D11ED] bg-[#272a3a] text-white outline-none"
                  placeholder="Ex: 123456"
                  required
                />
                <button
                  type="button"
                  onClick={generateMatchId}
                  className="px-4 py-3 cursor-pointer bg-[#8D11ED] hover:bg-[#7a0ed3] text-white rounded font-bold transition-colors"
                  title="Gerar ID único"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8.5 6a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM12 8a1 1 0 11-2 0 1 1 0 012 0zm-4 4a1 1 0 11-2 0 1 1 0 012 0zm4 0a1 1 0 11-2 0 1 1 0 012 0z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="mb-5">
              <label className="block text-[#eaeaea] mb-2 font-semibold">
                Senha
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="flex-1 p-3 rounded border border-[#8D11ED] bg-[#272a3a] text-white outline-none"
                  placeholder="Ex: 789012"
                  required
                />
                <button
                  type="button"
                  onClick={generatePassword}
                  className="px-4 py-3 cursor-pointer bg-[#8D11ED] hover:bg-[#7a0ed3] text-white rounded font-bold transition-colors"
                  title="Gerar senha única"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Botão para gerar ambos */}
            <div className="mb-5 flex justify-center">
              <button
                type="button"
                onClick={generateBoth}
                className="px-6 py-2 cursor-pointer bg-[#00ff88] hover:bg-[#00e677] text-black rounded font-bold transition-colors flex items-center gap-2"
                title="Gerar ID e senha únicos"
              >
                <svg
                  className="w-4 h-4 inline mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                    clipRule="evenodd"
                  />
                </svg>{" "}
                Gerar Ambos
              </button>
            </div>

            <div className="mb-5">
              <label className="block text-[#eaeaea] mb-2 font-semibold">
                Jogo
              </label>
              <select
                value={formData.gameId}
                onChange={(e) =>
                  setFormData({ ...formData, gameId: parseInt(e.target.value) })
                }
                className="w-full p-3 rounded border border-[#8D11ED] bg-[#272a3a] text-white outline-none"
                required
              >
                {games.map((game: any) => (
                  <option key={game.id} value={game.id}>
                    {game.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-5">
              <label className="block text-[#eaeaea] mb-2 font-semibold">
                Game Master
              </label>
              <input
                type="text"
                value={formData.gameMaster}
                onChange={(e) =>
                  setFormData({ ...formData, gameMaster: e.target.value })
                }
                className="w-full p-3 rounded border border-[#8D11ED] bg-[#272a3a] text-white outline-none"
              />
            </div>
            <div className="mb-7">
              <label className="block text-[#eaeaea] mb-2 font-semibold">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full p-3 rounded border border-[#8D11ED] bg-[#272a3a] text-white outline-none min-h-[60px]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 cursor-pointer bg-[#7a0ed3] text-white rounded font-bold hover:bg-[#8D11ED]"
            >
              Criar Partida
            </button>
          </form>
        </Modal>
      </main>
    </div>
  );
}
