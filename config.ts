// Configuração da API
const envUrl = (globalThis as any).process?.env?.NEXT_PUBLIC_API_URL as string | undefined;

const isBrowser = typeof window !== 'undefined';
const isHttps = isBrowser && window.location.protocol === 'https:';

// On HTTPS environments (e.g., Vercel), use server-side proxy to avoid mixed-content
// IP atualizado para: 108.165.179.162
export const API_URL = envUrl || (isHttps ? '/api/proxy' : 'http://108.165.179.162:5000/api');
