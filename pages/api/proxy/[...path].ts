import type { NextApiRequest, NextApiResponse } from 'next';

// URL do backend - pode ser configurada via variável de ambiente na Vercel
const BACKEND_URL = process.env.BACKEND_API_URL || 'http://37.148.132.118:5000/api';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Pega o path da URL (tudo após /api/proxy/)
  const { path } = req.query;
  const pathString = Array.isArray(path) ? path.join('/') : path || '';

  // Constrói a URL do backend
  const backendUrl = `${BACKEND_URL}/${pathString}`;

  // Prepara os headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Repassa o header de Authorization se existir
  if (req.headers.authorization) {
    headers['Authorization'] = req.headers.authorization as string;
  }

  // Repassa Content-Type se especificado
  if (req.headers['content-type']) {
    headers['Content-Type'] = req.headers['content-type'] as string;
  }

  try {
    // Prepara o body apenas para métodos que suportam
    let body: string | undefined;
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }

    // Faz a requisição para o backend
    const response = await fetch(backendUrl, {
      method: req.method,
      headers,
      body,
    });

    // Lê a resposta
    const contentType = response.headers.get('content-type');
    let data: any = {};

    if (contentType && contentType.includes('application/json')) {
      data = await response.json().catch(() => ({}));
    } else {
      const text = await response.text().catch(() => '');
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text || 'Resposta não JSON' };
      }
    }

    const status = response.status;

    // Retorna a resposta com o mesmo status code
    res.status(status).json(data);
  } catch (error: any) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      message: 'Erro ao conectar com o servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

