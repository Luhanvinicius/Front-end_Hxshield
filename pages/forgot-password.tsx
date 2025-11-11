import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { API_URL } from "../config";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email.trim()) {
      setError("Por favor, informe seu e-mail.");
      return;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("E-mail inválido. Por favor, verifique o formato.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/auth/forgot-password`, {
        email: email.trim(),
      });
      setSuccess(true);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "";
      if (errorMessage.toLowerCase().includes("não encontrado") || 
          errorMessage.toLowerCase().includes("not found") ||
          error.response?.status === 404) {
        setError("E-mail não encontrado em nosso sistema.");
      } else if (errorMessage) {
        setError(errorMessage);
      } else {
        setError("Erro ao enviar e-mail. Tente novamente mais tarde.");
      }
    } finally {
      setLoading(false);
    }
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
          Esqueci minha senha
        </h1>
        
        {success ? (
          <div className="space-y-5">
            <div className="bg-green-600/20 border border-green-500 text-green-400 px-5 py-3 rounded text-center text-sm font-medium">
              E-mail enviado com sucesso! Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
            </div>
            <button
              onClick={() => router.push("/")}
              className="w-full py-2 cursor-pointer bg-[#8D11ED] hover:bg-[#7a0ed3] hover:scale-[1.02] transition-all text-white font-bold rounded-lg duration-200 focus:outline-none focus:ring-2 focus:ring-[#8D11ED]"
            >
              Voltar para o login
            </button>
          </div>
        ) : (
          <>
            <p className="text-gray-300 text-center mb-6 text-sm">
              Digite seu e-mail cadastrado e enviaremos um link para redefinir sua senha.
            </p>
            
            {error && (
              <div className="mb-4 text-center text-red-400 font-semibold py-2 rounded text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block mb-1 font-semibold text-white"
                >
                  E-mail
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8D11ED] focus:border-transparent bg-black text-white"
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 cursor-pointer bg-[#8D11ED] hover:bg-[#7a0ed3] hover:scale-[1.02] transition-all text-white font-bold rounded-lg duration-200 focus:outline-none focus:ring-2 focus:ring-[#8D11ED] disabled:bg-[#8D11ED] disabled:opacity-50"
              >
                {loading ? "Enviando..." : "Enviar link de recuperação"}
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

