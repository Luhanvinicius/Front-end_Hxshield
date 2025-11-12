// Configuração da API
const envUrl = (globalThis as any).process?.env?.NEXT_PUBLIC_API_URL as string | undefined;

const isBrowser = typeof window !== 'undefined';
const isHttps = isBrowser && window.location.protocol === 'https:';

// API está em subdomínio separado com HTTPS: api.hshield.pro (VPS)
// Web está em: www.hshield.pro (Vercel)
// Sempre usa HTTPS para a API (ou proxy do Vercel em ambiente HTTPS)
export const API_URL = envUrl || (isHttps ? '/api/proxy' : 'https://api.hshield.pro/api');
