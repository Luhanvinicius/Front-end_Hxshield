import { useRouter } from "next/router";
import { useState, useEffect } from "react";

interface SidebarProps {
  currentPage?: string;
}

function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[#1a1a2e] border-2 border-[#8D11ED] rounded-2xl shadow-xl p-8 max-w-xs w-full relative animate-[fadeIn_.25s]">
        <h2 className="text-xl font-bold text-[#8D11ED] text-center mb-3">
          {title}
        </h2>
        <p className="text-white text-center mb-7">{message}</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-700 text-white rounded-lg font-bold hover:bg-gray-600 focus:outline-none"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-[#8D11ED] text-white rounded-lg font-bold hover:bg-[#7a0ed3] focus:outline-none"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({ currentPage }: SidebarProps) {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string>("");
  const [showLogout, setShowLogout] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (token) {
        try {
          const tokenParts = token.split(".");
          const payload = JSON.parse(atob(tokenParts[1]));

          // Debug: log do payload para verificar as chaves disponíveis
          console.log("JWT Payload:", payload);

          // Tentar diferentes chaves possíveis para o role
          let role =
            payload[
              "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ] ||
            payload["role"] ||
            payload["Role"] ||
            payload["userRole"] ||
            payload["UserRole"] ||
            payload["roles"]?.[0] ||
            "";

          // Fallback: verificar no userData do localStorage
          if (!role && userData) {
            try {
              const user = JSON.parse(userData);
              role =
                user.role || user.Role || user.userRole || user.UserRole || "";
            } catch (e) {
              console.error("Error parsing user data:", e);
            }
          }

          console.log("Detected role:", role);
          setUserRole(role);
        } catch (e) {
          console.error("Error parsing token:", e);
        }
      }
    }
  }, []);

  const getNavLinkClass = (page: string) => {
    const baseClass =
      "text-gray-400 hover:bg-[#7a0ed3] hover:text-[#eaeaea] px-4 py-2 rounded transition text-base";
    const activeClass =
      "bg-[#7a0ed3] text-[#eaeaea] px-4 py-2 rounded font-bold";
    return currentPage === page ? activeClass : baseClass;
  };

  const renderNavLinks = () => {
    const links = [];

    // Admin vê tudo
    if (userRole === "Admin") {
      links.push(
        { href: "/dashboard", label: "Dashboard" },
        { href: "/matches", label: "Partidas" },
        { href: "/players", label: "Jogadores" },
        { href: "/banned", label: "Lista de Banidos" },
        { href: "/player-dashboard", label: "Histórico de partidas" },
        { href: "/gm-register", label: "Cadastro de GM" },
        { href: "/licenses", label: "Licenças" },
        // { href: "/clients", label: "Clientes" },
        // { href: "/detections", label: "Detecções" }
      );
    }
    // GM vê links específicos
    else if (userRole === "GM") {
      links.push(
        { href: "/gm-dashboard", label: "Dashboard" },
        { href: "/player-dashboard", label: "Histórico de partidas" },
        { href: "/matches", label: "Partidas" },
        { href: "/banned", label: "Lista de Banidos" }
      );
    }
    // Usuário comum vê apenas dashboard de player
    else {
      links.push(
        { href: "/player-dashboard", label: "Histórico de partidas" },
        { href: "/banned", label: "Lista de Banidos" }
      );
    }

    // Download aparece para todos os roles
    const downloadUrl = "https://cdn.discordapp.com/attachments/1369124966901088347/1437991281669177485/HSHIELD.exe?ex=6915413e&is=6913efbe&hm=92ddbdf13269f34e55827dda420d2cd65ce88458494ddc9e69a422a570556d68&";

    return (
      <>
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={getNavLinkClass(link.href.replace("/", ""))}
          >
            {link.label}
          </a>
        ))}
        <a
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:bg-[#7a0ed3] hover:text-[#eaeaea] px-4 py-2 rounded transition text-base flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Download
        </a>
      </>
    );
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <aside className="w-[250px] bg-[#1a1a2e] p-5 flex flex-col border-r border-[#16213e]">
      <img
        src="/logohx.png"
        alt="Hxshield Logo"
        className="mx-auto mb-4 w-80 h-36 object-cover"
      />
      <h1 className="text-2xl font-semibold text-center text-[#8D11ED] mb-6">
        Bem-vindo ao Hshield
      </h1>

      {/* Debug: mostrar role detectado temporariamente
      <div className="mb-4 p-2 bg-yellow-600 text-black text-xs rounded">
        Debug - Role: {userRole || 'Nenhum role detectado'}
      </div> */}

      <nav className="flex flex-col gap-3 text-base">{renderNavLinks()}</nav>
      <div className="mt-auto pt-5">
        <ConfirmModal
          open={showLogout}
          onClose={() => setShowLogout(false)}
          onConfirm={confirmLogout}
          title="Sair da Plataforma"
          message="Tem certeza que deseja sair da aplicação?"
        />
        <button
          onClick={() => setShowLogout(true)}
          className="w-full py-2 cursor-pointer bg-[#8D11ED] hover:bg-[#7a0ed3] hover:scale-[1.02] transition-all text-white font-bold rounded-lg duration-200 focus:outline-none focus:ring-2 focus:ring-[#8D11ED] disabled:bg-[#8D11ED]"
        >
          Sair
        </button>
      </div>
    </aside>
  );
}
