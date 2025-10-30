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
  const [cpfError, setCpfError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Função para validar email
  const validateEmail = (email: string): boolean => {
    if (!email || !email.trim()) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  // Função para formatar CPF com máscara
  const formatCPF = (value: string): string => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, "");
    // Aplica a máscara
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
  };

  // Função para validar CPF
  const validateCPF = (cpf: string): boolean => {
    // Remove formatação
    const cleanCPF = cpf.replace(/\D/g, "");
    
    // Verifica se tem 11 dígitos
    if (cleanCPF.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais (CPF inválido)
    if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
    
    // Validação dos dígitos verificadores
    let sum = 0;
    let remainder: number;
    
    // Valida primeiro dígito verificador
    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.substring(9, 10))) return false;
    
    // Valida segundo dígito verificador
    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.substring(10, 11))) return false;
    
    return true;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCpfError("");
    
    // Validação de campos obrigatórios
    if (!formData.username?.trim()) {
      setError("O campo Usuário é obrigatório.");
      return;
    }
    if (!formData.fullName?.trim()) {
      setError("O campo Nome Completo é obrigatório.");
      return;
    }
    if (!formData.nickname?.trim()) {
      setError("O campo Nickname é obrigatório.");
      return;
    }
    if (!formData.cpf?.trim()) {
      setError("O campo CPF é obrigatório.");
      return;
    }
    
    // Validação de CPF
    const cleanCPF = formData.cpf.replace(/\D/g, "");
    if (cleanCPF.length !== 11) {
      setError("CPF deve conter 11 dígitos.");
      setCpfError("CPF deve conter 11 dígitos.");
      return;
    }
    if (!validateCPF(formData.cpf)) {
      setError("CPF inválido. Por favor, verifique os dados informados.");
      setCpfError("CPF inválido.");
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
    setEmailError("");
    if (!formData.email?.trim()) {
      setError("O campo E-mail é obrigatório.");
      setEmailError("O campo E-mail é obrigatório.");
      return;
    }
    // Validação básica de email
    if (!validateEmail(formData.email)) {
      setError("E-mail inválido. Por favor, verifique o formato.");
      setEmailError("E-mail inválido. Use o formato: seu@email.com");
      return;
    }
    if (!formData.password?.trim()) {
      setError("O campo Senha é obrigatório.");
      return;
    }
    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (!formData.confirmPassword?.trim()) {
      setError("O campo Confirmar Senha é obrigatório.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    setLoading(true);
    try {
      // Envia CPF sem formatação (apenas números)
      const cleanCPF = formData.cpf.replace(/\D/g, "");
      await axios.post(`${API_URL}/auth/register`, {
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: "User",
        nickname: formData.nickname.trim(),
        fullName: formData.fullName.trim(),
        cpf: cleanCPF,
      });
      alert("Cadastro realizado com sucesso! Você pode fazer login agora.");
      router.push("/");
    } catch (error: any) {
      // Tratamento específico para email já em uso
      const errorMessage = error.response?.data?.message || "";
      const errorStatus = error.response?.status;
      
      if (errorMessage.toLowerCase().includes("email") && 
          (errorMessage.toLowerCase().includes("já") || 
           errorMessage.toLowerCase().includes("ja") ||
           errorMessage.toLowerCase().includes("already") ||
           errorMessage.toLowerCase().includes("exist") ||
           errorStatus === 409)) {
        setError("Este e-mail já está em uso. Por favor, use outro e-mail ou faça login.");
        setEmailError("Este e-mail já está em uso.");
      } else if (errorMessage.toLowerCase().includes("username") && 
                 (errorMessage.toLowerCase().includes("já") || 
                  errorMessage.toLowerCase().includes("ja") ||
                  errorMessage.toLowerCase().includes("already") ||
                  errorMessage.toLowerCase().includes("exist"))) {
        setError("Este usuário já está em uso. Por favor, escolha outro nome de usuário.");
      } else if (errorMessage) {
        setError(errorMessage);
      } else {
        setError("Erro ao realizar cadastro. Tente novamente.");
      }
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
                    Usuário <span className="text-red-400">*</span>
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
                    Nome Completo <span className="text-red-400">*</span>
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
                    Nickname <span className="text-red-400">*</span>
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
                    CPF <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    value={formData.cpf}
                    onChange={(e) => {
                      const formatted = formatCPF(e.target.value);
                      // Limita a 14 caracteres (formato: 000.000.000-00)
                      if (formatted.replace(/\D/g, "").length <= 11) {
                        setFormData({ ...formData, cpf: formatted });
                        setCpfError(""); // Limpa erro ao digitar
                      }
                    }}
                    onBlur={() => {
                      const cleanCPF = formData.cpf.replace(/\D/g, "");
                      if (cleanCPF.length > 0 && cleanCPF.length !== 11) {
                        setCpfError("CPF deve conter 11 dígitos.");
                      } else if (cleanCPF.length === 11 && !validateCPF(formData.cpf)) {
                        setCpfError("CPF inválido.");
                      } else {
                        setCpfError("");
                      }
                    }}
                    maxLength={14}
                    className={`p-3 rounded border bg-black text-white outline-none focus:border-[#8D11ED] border-white w-full ${
                      cpfError ? "border-red-500" : ""
                    }`}
                    required
                  />
                  {cpfError && (
                    <small className="text-xs text-red-400">{cpfError}</small>
                  )}
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
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      setEmailError(""); // Limpa erro ao digitar
                    }}
                    onBlur={() => {
                      if (formData.email.trim() && !validateEmail(formData.email)) {
                        setEmailError("E-mail inválido. Use o formato: seu@email.com");
                      } else {
                        setEmailError("");
                      }
                    }}
                    className={`p-3 rounded border bg-black text-white outline-none focus:border-[#8D11ED] border-white w-full ${
                      emailError ? "border-red-500" : ""
                    }`}
                    required
                  />
                  {emailError && (
                    <small className="text-xs text-red-400">{emailError}</small>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-gray-100 text-sm font-semibold">
                    Senha <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua senha (mínimo 6 caracteres)"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="p-3 rounded border bg-black text-white outline-none focus:border-[#8D11ED] border-white w-full pr-10"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                      className="absolute top-1/2 right-2 -translate-y-1/2 p-1 text-gray-400 hover:text-[#8D11ED] focus:outline-none"
                      onClick={() => setShowPassword((v) => !v)}
                    >
                      {showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4.03-9-7 0-1.11.335-2.163.946-3.13M10.05 6.175c.638-.11 1.3-.175 1.95-.175 5 0 9 4.03 9 7 0 1.556-.579 3.012-1.63 4.33M9.88 9.88a3 3 0 104.24 4.24"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 3l18 18"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-gray-100 text-sm font-semibold">
                    Confirmar Senha <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Digite a senha novamente"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="p-3 rounded border bg-black text-white outline-none focus:border-[#8D11ED] border-white w-full pr-10"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
                      className="absolute top-1/2 right-2 -translate-y-1/2 p-1 text-gray-400 hover:text-[#8D11ED] focus:outline-none"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                    >
                      {showConfirmPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4.03-9-7 0-1.11.335-2.163.946-3.13M10.05 6.175c.638-.11 1.3-.175 1.95-.175 5 0 9 4.03 9 7 0 1.556-.579 3.012-1.63 4.33M9.88 9.88a3 3 0 104.24 4.24"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 3l18 18"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
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
