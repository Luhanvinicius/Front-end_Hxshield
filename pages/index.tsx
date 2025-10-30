import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { API_URL } from "../config";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if already logged in
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        router.push("/dashboard");
      }
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setServerError("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        // Redireciona baseado no role
        const userRole = response.data.user.role;
        if (userRole === "User") {
          router.push("/player-dashboard");
        } else if (userRole === "GM") {
          router.push("/gm-dashboard");
        } else {
          router.push("/dashboard");
        }
        return;
      }
      setError("Usuário ou senha inválidos");
    } catch (error: any) {
      // AxiosError typing friendly
      if (error.response) {
        // Erro tratado pela API (400, 401, 403...)
        if (error.response.status === 401 || error.response.status === 400) {
          setError("Usuário ou senha inválidos");
        } else {
          setServerError(
            error.response.data?.message || "Erro desconhecido do servidor."
          );
        }
      } else {
        setServerError("Erro de conexão com o servidor. Tente novamente.");
      }
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#000] to-[#15001a] p-5">
      <div className="w-full max-w-lg mx-auto bg-transparent rounded-2xl shadow-2xl p-12 backdrop-blur-3xl border-2 border-[#8D11ED]">
        <img
          src="/logohx.png"
          alt="Hxshield Logo"
          className="mx-auto mb-4 w-72 h-36 object-cover"
        />
        <h1 className="text-2xl font-semibold text-center text-[#8D11ED] mb-6">
          Bem-vindo ao Hshield
        </h1>
        {error && (
          <div className="mt-1 mb-4 text-center text-red-600 font-semibold  py-2 rounded">
            {error}
          </div>
        )}
        {serverError && (
          <div className="mt-1 mb-4 text-center text-orange-500 font-semibold  py-2 rounded">
            {serverError}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="block mb-1 font-semibold text-white"
            >
              Usuário
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Digite seu Usuário"
              required
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8D11ED] focus:border-transparent text-white"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-1 font-semibold text-white"
            >
              Senha
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                placeholder="Digite sua senha"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8D11ED] focus:border-transparent text-white pr-10"
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
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-2 cursor-pointer bg-[#8D11ED] hover:bg-[#7a0ed3] hover:scale-[1.02] transition-all text-white font-bold rounded-lg duration-200 focus:outline-none focus:ring-2 focus:ring-[#8D11ED] disabled:bg-[#8D11ED]"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
        <div className="h-1 rounded-full mx-auto bg-white mt-12"></div>
        <p className="text-center text-white py-6">OU</p>
        <a href="/register">
          <button className="w-full py-2 cursor-pointer bg-[#8D11ED] hover:bg-[#7a0ed3] hover:scale-[1.02] transition-all text-white font-bold rounded-lg duration-200 focus:outline-none focus:ring-2 focus:ring-[#8D11ED] disabled:bg-[#8D11ED]">
            Criar conta
          </button>
        </a>
      </div>
    </main>
  );
}
