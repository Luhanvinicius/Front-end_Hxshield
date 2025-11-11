import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { API_URL } from "../config";
import Sidebar from "../components/Sidebar";

function Modal({ open, onClose, msg }: { open: boolean; onClose: () => void; msg: string }) {
  if (!open) return null;
  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="bg-[#1a1a2e] border-2 border-[#8D11ED] rounded-2xl shadow-xl p-8 min-w-[320px] max-w-[90vw] text-white text-center animate-[fadeIn_.2s] font-semibold" onClick={e=>e.stopPropagation()}>{msg}</div>
    </div>
  );
}

export default function GMRegister() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [modalMsg, setModalMsg] = useState("");

  const createGM = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}/auth/register-gm`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData({ username: "", email: "", password: "" });
      setModalMsg("GM cadastrado com sucesso!");
    } catch (error: any) {
      setModalMsg(error.response?.data?.message || "Erro ao cadastrar GM");
    } finally {
      setLoading(false);
      setTimeout(() => setModalMsg("") , 2000);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0f1419]">
      <Modal open={!!modalMsg} onClose={() => setModalMsg("")} msg={modalMsg} />
      <Sidebar currentPage="gm-register" />
      <main className="flex-1 p-10 overflow-auto flex justify-center items-start">
        <div className="max-w-lg w-full bg-[#2d3748] rounded-xl border border-[#2d3748] p-10 shadow-xl">
          <h1 className="text-3xl font-bold text-[#eaeaea] mb-8">Cadastro de Game Master</h1>
          <form onSubmit={createGM}>
            <div className="mb-6">
              <label className="block text-[#eaeaea] mb-2 font-semibold">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={e => setFormData({ ...formData, username: e.target.value })}
                className="w-full p-3 rounded border border-[#8D11ED] bg-[#272a3a] text-white outline-none"
                required
                placeholder="Digite o nome de usuário"
              />
            </div>
            <div className="mb-6">
              <label className="block text-[#eaeaea] mb-2 font-semibold">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-3 rounded border border-[#8D11ED] bg-[#272a3a] text-white outline-none"
                required
                placeholder="exemplo@email.com"
              />
            </div>
            <div className="mb-10">
              <label className="block text-[#eaeaea] mb-2 font-semibold">Senha</label>
              <input
                type="password"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                className="w-full p-3 rounded border border-[#8D11ED] bg-[#272a3a] text-white outline-none"
                required
                placeholder="Digite uma senha"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#7a0ed3] text-white rounded font-bold text-base hover:bg-[#8D11ED] disabled:bg-[#b494df]"
            >{loading ? "Cadastrando..." : "Cadastrar GM"}</button>
          </form>
        </div>
      </main>
    </div>
  );
}
