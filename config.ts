// Configuração da API
// Para VPS, altere para o IP público ou domínio
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' 
    ? `http://${window.location.hostname}:5000/api`
    : 'http://localhost:5000/api');



