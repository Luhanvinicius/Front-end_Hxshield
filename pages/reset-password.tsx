import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { API_URL } from "../config";

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);

  useEffect(() => {
    if (token && typeof token === "string") {
      validateToken(token);
    } else if (router.isReady && !token) {
      setError("Token inválido ou expirado.");
      setValidatingToken(false);
    }
  }, [token, router.isReady]);

  const validateToken = async (tokenValue: string) => {
    try {
      await axios.get(`${API_URL}/auth/validate-reset-token/${tokenValue}`);
      setValidatingToken(false);
    } catch (error: any) {
      setError("Token inválido ou expirado. Solicite um novo link de recuperação.");
      setValidatingToken(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password.trim()) {
      setError("O campo Senha é obrigatório.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (!confirmPassword.trim()) {
      setError("O campo Confirmar Senha é obrigatório.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (!token || typeof token !== "string") {
      setError("Token inválido.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/auth/reset-password`, {
        token,
        newPassword: password,
      });
      setSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "";
      if (errorMessage.toLowerCase().includes("token") && 
          (errorMessage.toLowerCase().includes("inválido") || 
           errorMessage.toLowerCase().includes("expirado") ||
           errorMessage.toLowerCase().includes("invalid") ||
           errorMessage.toLowerCase().includes("expired"))) {
        setError("Token inválido ou expirado. Solicite um novo link de recuperação.");
      } else if (errorMessage) {
        setError(errorMessage);
      } else {
        setError("Erro ao redefinir senha. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (validatingToken) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#000] to-[#15001a] p-5">
        <div className="w-full max-w-lg mx-auto bg-transparent rounded-2xl shadow-2xl p-12 backdrop-blur-3xl border-2 border-[#8D11ED]">
          <div className="text-center text-white">
            <p className="text-lg">Validando token...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#000] to-[#15001a] p-5">
      <div className="w-full max-w-lg mx-auto bg-transparent rounded-2xl shadow-2xl p-12 backdrop-blur-3xl border-2 border-[#8D11ED]">
        <img
          src="/logohx.png"
          alt="Hxshield Logo"
          className="mx-auto mb-4 w-72 h-36 object-cover"
        />
        <h1 className="text-2xl font-semibold text-center text-[#8D11ED] mb-6">
          Redefinir Senha
        </h1>

        {success ? (
          <div className="space-y-5">
            <div className="bg-green-600/20 border border-green-500 text-green-400 px-5 py-3 rounded text-center text-sm font-medium">
              Senha redefinida com sucesso! Redirecionando para o login...
            </div>
            <button
              onClick={() => router.push("/")}
              className="w-full py-2 cursor-pointer bg-[#8D11ED] hover:bg-[#7a0ed3] hover:scale-[1.02] transition-all text-white font-bold rounded-lg duration-200 focus:outline-none focus:ring-2 focus:ring-[#8D11ED]"
            >
              Ir para o login
            </button>
          </div>
        ) : error && !password && !confirmPassword ? (
          <div className="space-y-5">
            <div className="bg-red-600/20 border border-red-500 text-red-400 px-5 py-3 rounded text-center text-sm font-medium">
              {error}
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => router.push("/forgot-password")}
                className="flex-1 py-2 cursor-pointer bg-[#8D11ED] hover:bg-[#7a0ed3] hover:scale-[1.02] transition-all text-white font-bold rounded-lg duration-200 focus:outline-none focus:ring-2 focus:ring-[#8D11ED]"
              >
                Solicitar novo link
              </button>
              <button
                onClick={() => router.push("/")}
                className="flex-1 py-2 cursor-pointer bg-gray-700 hover:bg-gray-600 hover:scale-[1.02] transition-all text-white font-bold rounded-lg duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Voltar ao login
              </button>
            </div>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 text-center text-red-400 font-semibold py-2 rounded text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="password"
                  className="block mb-1 font-semibold text-white"
                >
                  Nova Senha <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua nova senha (mínimo 6 caracteres)"
                    required
                    autoFocus
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8D11ED] focus:border-transparent bg-black text-white pr-10"
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

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block mb-1 font-semibold text-white"
                >
                  Confirmar Nova Senha <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Digite a senha novamente"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8D11ED] focus:border-transparent bg-black text-white pr-10"
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 cursor-pointer bg-[#8D11ED] hover:bg-[#7a0ed3] hover:scale-[1.02] transition-all text-white font-bold rounded-lg duration-200 focus:outline-none focus:ring-2 focus:ring-[#8D11ED] disabled:bg-[#8D11ED] disabled:opacity-50"
              >
                {loading ? "Redefinindo..." : "Redefinir Senha"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <a
                href="/"
                className="text-white underline text-sm font-medium hover:text-[#8D11ED] transition"
              >
                Voltar para o login
              </a>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

