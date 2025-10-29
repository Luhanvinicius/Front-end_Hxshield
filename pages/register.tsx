import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { API_URL } from "../config";

export default function Register() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    nickname: "",
    fullName: "",
    cpf: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (
      !formData.username ||
      !formData.fullName ||
      !formData.nickname ||
      !formData.cpf
    ) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }
    setStep(2);
  };

  const handleBack = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setStep(1);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }
    if (!formData.email) {
      setError("O e-mail é obrigatório.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_URL}/auth/register`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: "User",
        nickname: formData.nickname,
        fullName: formData.fullName,
        cpf: formData.cpf,
      });
      alert("Cadastro realizado com sucesso! Você pode fazer login agora.");
      router.push("/");
    } catch (error: any) {
      setError(error.response?.data?.message || "Erro ao realizar cadastro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-black to-[#15001a] p-5">
      <div className="max-w-2xl w-full mx-auto bg-transparent rounded-2xl shadow-2xl p-12 backdrop-blur-3xl border-2 border-[#8D11ED]">
        <h1 className="text-2xl font-semibold text-center text-[#8D11ED] mb-6">
          Insira seus dados
        </h1>
        <form
          onSubmit={step === 1 ? handleNext : handleRegister}
          className="flex items-center justify-center flex-col w-full"
        >
          {error && (
            <div className="bg-pink-600 text-white px-5 py-2 mb-4 rounded text-center text-sm font-medium shadow">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 gap-y-5 w-full">
            {step === 1 ? (
              <>
                <p className="text-white font-bold text-end">
                  Etapa <span className="text-[#8D11ED]">{step} </span>de{" "}
                  <span className="text-[#8D11ED]">2</span>
                </p>
                <div className="flex flex-col gap-2">
                  <label className="text-gray-100 text-sm font-semibold">
                    Usuário
                  </label>
                  <input
                    type="text"
                    placeholder="Digite seu usuário"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    className="p-3 rounded border bg-black text-white outline-none focus:border-[#8D11ED] border-white w-full"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-gray-100 text-sm font-semibold">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    placeholder="Seu nome completo"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="p-3 rounded border bg-black text-white outline-none focus:border-[#8D11ED] border-white w-full"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-gray-100 text-sm font-semibold">
                    Nickname
                  </label>
                  <input
                    type="text"
                    placeholder="Mesmo nome do jogo"
                    value={formData.nickname}
                    onChange={(e) =>
                      setFormData({ ...formData, nickname: e.target.value })
                    }
                    className="p-3 rounded border bg-black text-white outline-none focus:border-[#8D11ED] border-white w-full"
                    required
                  />
                  <small className="text-xs text-zinc-300">
                    ⚠️ Deve ser IDÊNTICO ao nickname do seu jogo
                  </small>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-gray-100 text-sm font-semibold">
                    CPF
                  </label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    value={formData.cpf}
                    onChange={(e) =>
                      setFormData({ ...formData, cpf: e.target.value })
                    }
                    className="p-3 rounded border bg-black text-white outline-none focus:border-[#8D11ED] border-white w-full"
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <p className="text-white font-bold text-end">
                  Etapa <span className="text-[#8D11ED]">{step} </span>de{" "}
                  <span className="text-[#8D11ED]">2</span>
                </p>
                <div className="flex flex-col gap-2">
                  <label className="text-gray-100 text-sm font-semibold">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="p-3 rounded border bg-black text-white outline-none focus:border-[#8D11ED] border-white w-full"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-gray-100 text-sm font-semibold">
                    Senha
                  </label>
                  <input
                    type="password"
                    placeholder="Digite sua senha"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="p-3 rounded border bg-black text-white outline-none focus:border-[#8D11ED] border-white w-full"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-gray-100 text-sm font-semibold">
                    Confirmar Senha
                  </label>
                  <input
                    type="password"
                    placeholder="Digite a senha novamente"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="p-3 rounded border bg-black text-white outline-none focus:border-[#8D11ED] border-white w-full"
                    required
                  />
                </div>
              </>
            )}
          </div>
          <div className="w-full mt-8 flex flex-row-reverse justify-between gap-4">
            {step === 2 && (
              <button
                type="button"
                onClick={handleBack}
                className="w-full py-2 cursor-pointer bg-[#8D11ED] hover:bg-[#7a0ed3] hover:scale-[1.02] transition-all text-white font-bold rounded-lg duration-200 focus:outline-none focus:ring-2 focus:ring-[#8D11ED] disabled:bg-[#8D11ED]"
              >
                Voltar
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 cursor-pointer bg-[#8D11ED] hover:bg-[#7a0ed3] hover:scale-[1.02] transition-all text-white font-bold rounded-lg duration-200 focus:outline-none focus:ring-2 focus:ring-[#8D11ED] disabled:bg-[#8D11ED]"
            >
              {step === 1
                ? "Próximo"
                : loading
                ? "Cadastrando..."
                : "Cadastrar"}
            </button>
          </div>
          <div className="w-full text-center mt-4">
            <a
              href="/"
              className="text-white underline text-sm font-medium hover:text-[#8D11ED] transition"
            >
              Já tem uma conta? Faça login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
