import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { API_URL } from '../config';
import Sidebar from '../components/Sidebar';

function Modal({ open, onClose, children }: any) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={onClose}>
      <div className="bg-[#1e2749] p-10 rounded-xl min-w-[350px]" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export default function Licenses() {
  const router = useRouter();
  const [licenses, setLicenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ daysValid: 30, maxDevices: 1 });
  const [modalMsg, setModalMsg] = useState("");

  useEffect(() => { checkAuth(); loadLicenses(); }, []);

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
      // ignore
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
      setModalMsg('Licença criada com sucesso!');
      setTimeout(() => setModalMsg("") , 2000);
    } catch (error: any) {
      setModalMsg(error.response?.data?.message || 'Erro ao criar licença');
      setTimeout(() => setModalMsg("") , 2000);
    }
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString('pt-BR');
  const getStatusColor = (license: any) => {
    if (!license.isActive) return 'text-gray-400';
    if (new Date(license.expiresAt) < new Date()) return 'text-[#ff3366]';
    return 'text-[#00ff88]';
  };

  return (
    <div className="flex min-h-screen bg-[#0f1419]">
      {modalMsg && (
        <div className="fixed z-50 top-6 left-1/2 -translate-x-1/2 bg-[#1a1a2e] border-2 border-[#8D11ED] px-8 py-3 rounded-xl shadow-xl text-white font-semibold animate-[fadeIn_.2s]">
          {modalMsg}
        </div>
      )}
      <Sidebar currentPage="licenses" />
      <main className="flex-1 p-10 overflow-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl text-[#eaeaea] font-bold">Licenças</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#7a0ed3] text-white rounded cursor-pointer px-7 py-3 text-base font-bold hover:bg-[#8D11ED]"
          >
            + Nova Licença
          </button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center text-[#eaeaea] text-lg py-12">
            Carregando...
          </div>
        ) : (
          <div className="bg-[#1e2749] rounded-xl p-6 border border-[#2d3748]">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-[#2d3748]">
                  <th className="p-3 text-xs text-gray-400 uppercase tracking-wider">
                    Chave
                  </th>
                  <th className="p-3 text-xs text-gray-400 uppercase tracking-wider">
                    Criada em
                  </th>
                  <th className="p-3 text-xs text-gray-400 uppercase tracking-wider">
                    Expira em
                  </th>
                  <th className="p-3 text-xs text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {licenses.map((license) => (
                  <tr key={license.id} className="border-b border-[#2d3748]">
                    <td className="p-3 text-[#eaeaea]">{license.key}</td>
                    <td className="p-3 text-[#eaeaea]">
                      {formatDate(license.createdAt)}
                    </td>
                    <td className="p-3 text-[#eaeaea]">
                      {formatDate(license.expiresAt)}
                    </td>
                    <td className={"p-3 font-bold " + getStatusColor(license)}>
                      {license.isActive ? "Ativa" : "Inativa"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Modal open={showModal} onClose={() => setShowModal(false)}>
          <h2 className="text-xl font-bold text-[#8D11ED] mb-5">
            Criar Nova Licença
          </h2>
          <form onSubmit={createLicense}>
            <div className="mb-5">
              <label className="block text-[#eaeaea] mb-2 font-semibold">
                Dias Válidos
              </label>
              <input
                type="number"
                value={formData.daysValid}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    daysValid: parseInt(e.target.value),
                  })
                }
                className="w-full p-3 rounded border border-[#8D11ED] bg-[#272a3a] text-white outline-none"
                required
              />
            </div>
            <div className="mb-7">
              <label className="block text-[#eaeaea] mb-2 font-semibold">
                Máximo de Dispositivos
              </label>
              <input
                type="number"
                value={formData.maxDevices}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxDevices: parseInt(e.target.value),
                  })
                }
                className="w-full p-3 rounded border border-[#8D11ED] bg-[#272a3a] text-white outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full cursor-pointer py-2 bg-[#7a0ed3] text-white rounded font-bold hover:bg-[#8D11ED]"
            >
              Criar Licença
            </button>
          </form>
        </Modal>
      </main>
    </div>
  );
}
