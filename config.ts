// Configuração da API
const envUrl = (globalThis as any).process?.env?.NEXT_PUBLIC_API_URL as string | undefined;

const isBrowser = typeof window !== 'undefined';
const isHttps = isBrowser && window.location.protocol === 'https:';

// API está em subdomínio separado com HTTPS: api.hshield.pro (VPS)
// Web está em: www.hshield.pro (Vercel)
// SEMPRE usa HTTPS para a API (nunca HTTP)
// Em ambiente HTTPS (Vercel), usa proxy. Em desenvolvimento local, usa HTTPS direto.

// Validação: se envUrl existir e for HTTP, força HTTPS
let finalUrl: string;
if (envUrl) {
  // Se a URL do ambiente começar com http://, substitui por https://
  finalUrl = envUrl.startsWith('http://') ? envUrl.replace('http://', 'https://') : envUrl;
} else {
  // Se não houver variável de ambiente, usa proxy em HTTPS ou HTTPS direto
  finalUrl = isHttps ? '/api/proxy' : 'https://api.hshield.pro/api';
}

export const API_URL = finalUrl;
