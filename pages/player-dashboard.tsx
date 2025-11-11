import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { API_URL } from '../config';
import Sidebar from '../components/Sidebar';

export default function PlayerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("history"); // profile, history, nickname, support

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
       
      } catch (e) {
        router.push('/');
      }
    }
    setLoading(false);
  };

  // Função para formatar CPF
  const formatCPF = (cpf: string | null | undefined): string => {
    if (!cpf) return 'Não informado';
    // Remove tudo que não é número
    const numbers = cpf.replace(/\D/g, "");
    if (numbers.length === 0) return 'Não informado';
    // Se tiver mais de 11 dígitos, pega apenas os últimos 11
    // Se tiver menos de 11, retorna como está (pode ser incompleto)
    const cpfNumbers = numbers.length > 11 ? numbers.slice(-11) : numbers;
    if (cpfNumbers.length !== 11) return cpf; // Retorna como está se não tiver 11 dígitos
    // Aplica a máscara: 000.000.000-00
    return `${cpfNumbers.slice(0, 3)}.${cpfNumbers.slice(3, 6)}.${cpfNumbers.slice(6, 9)}-${cpfNumbers.slice(9, 11)}`;
  };


  if (loading || !user) {
    return <div className="flex items-center justify-center min-h-screen text-[#eaeaea] text-lg">Carregando...</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#0f1419] font-sans">
      <Sidebar currentPage="player-dashboard" />
      <main className="flex-1 p-10 overflow-auto">
        {/* Navegação interna do player dashboard */}
        <div className="mb-8">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveSection('history')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                activeSection === 'history'
                  ? 'bg-[#8D11ED] text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Histórico de Partidas
            </button>
            <button
              onClick={() => setActiveSection('profile')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                activeSection === 'profile'
                  ? 'bg-[#8D11ED] text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Meu Perfil
            </button>
            <button
              onClick={() => setActiveSection('nickname')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                activeSection === 'nickname'
                  ? 'bg-[#8D11ED] text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Alterar Nickname
            </button>
            <button
              onClick={() => setActiveSection('support')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                activeSection === 'support'
                  ? 'bg-[#8D11ED] text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Suporte
            </button>
          </div>
        </div>
        {activeSection === 'profile' && (
          <>
            <h1 className="text-3xl text-[#eaeaea] font-bold mb-7">Meu Perfil</h1>
            <div className="bg-[#8D11ED] border border-[#2d3748] rounded-xl p-7 mb-7">
              <h3 className="text-sm text-gray-200 font-semibold mb-3">Nome Completo</h3>
              <p className="text-xl text-white m-0 font-medium">{user.fullName || 'Não informado'}</p>
            </div>
            <div className="bg-[#8D11ED] border border-[#2d3748] rounded-xl p-7 mb-7">
              <h3 className="text-sm text-gray-200 font-semibold mb-3">Nickname</h3>
              <p className="text-xl text-white m-0 font-medium">{user.nickname || 'Não informado'}</p>
            </div>
            <div className="bg-[#8D11ED] border border-[#2d3748] rounded-xl p-7 mb-7">
              <h3 className="text-sm text-gray-200 font-semibold mb-3">Email</h3>
              <p className="text-xl text-white m-0 font-medium">{user.email || 'Não informado'}</p>
            </div>
            <div className="bg-[#8D11ED] border border-[#2d3748] rounded-xl p-7 mb-7">
              <h3 className="text-sm text-gray-200 font-semibold mb-3">CPF</h3>
              <p className="text-xl text-white m-0 font-medium">{formatCPF(user.cpf)}</p>
            </div>
          </>
        )}
        {activeSection === 'history' && (
          <>
            <h1 className="text-3xl text-[#eaeaea] font-bold mb-7">Histórico de Partidas</h1>
            <div className="bg-[#8D11ED] border border-[#2d3748] rounded-xl p-7 mb-7">
              <p className="text-xl text-white m-0 font-medium">Seu histórico de partidas aparecerá aqui em breve.</p>
            </div>
          </>
        )}
        {activeSection === 'nickname' && (
          <>
            <h1 className="text-3xl text-[#eaeaea] font-bold mb-7">Solicitar Alteração de Nickname</h1>
            <div className="bg-[#8D11ED] border border-[#2d3748] rounded-xl p-7 mb-7">
              <h3 className="text-sm text-gray-200 font-semibold mb-3">Nickname Atual</h3>
              <p className="text-xl text-white m-0 font-medium">{user.nickname || 'Não informado'}</p>
              <p className="text-base text-gray-300 mt-5">A funcionalidade de solicitação de alteração de nickname estará disponível em breve.</p>
            </div>
          </>
        )}
        {activeSection === 'support' && (
          <>
            <h1 className="text-3xl text-[#eaeaea] font-bold mb-7">Suporte</h1>
            <div className="bg-[#8D11ED] border border-[#2d3748] rounded-xl p-7 mb-7">
              <h3 className="text-sm text-gray-200 font-semibold mb-3">Entre em Contato</h3>
              <p className="text-xl text-white m-0 font-medium">Seção de suporte estará disponível em breve.</p>
              <p className="text-base text-gray-300 mt-5">Em caso de problemas ou dúvidas, entre em contato com o suporte através dos canais oficiais.</p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

