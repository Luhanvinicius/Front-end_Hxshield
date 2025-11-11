import type { NextApiRequest, NextApiResponse } from 'next';

// URL do backend - pode ser configurada via variável de ambiente na Vercel
const BACKEND_URL = process.env.BACKEND_API_URL || 'http://108.165.179.162:5000/api';

// Desabilita o parsing automático do body pelo Next.js
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Permite apenas métodos HTTP suportados
  if (req.method && !['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Pega o path da URL (tudo após /api/proxy/)
  const { path } = req.query;
  const pathString = Array.isArray(path) ? path.join('/') : path || '';

  // Remove barras duplicadas e constrói a URL do backend
  const cleanPath = pathString.replace(/^\/+|\/+$/g, ''); // Remove barras no início e fim
  const backendUrl = `${BACKEND_URL.replace(/\/$/, '')}/${cleanPath}`;

  // Prepara os headers
  const headers: Record<string, string> = {};

  // Repassa o header de Authorization se existir
  if (req.headers.authorization) {
    headers['Authorization'] = req.headers.authorization as string;
  }

  // Repassa Content-Type se especificado, senão usa application/json
  if (req.headers['content-type']) {
    headers['Content-Type'] = req.headers['content-type'] as string;
  } else if (req.method !== 'GET' && req.method !== 'HEAD' && req.method !== 'OPTIONS') {
    headers['Content-Type'] = 'application/json';
  }

  try {
    // Prepara o body apenas para métodos que suportam
    let body: string | undefined;
    if (req.method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      if (req.body) {
        if (typeof req.body === 'string') {
          body = req.body;
        } else if (typeof req.body === 'object' && Object.keys(req.body).length > 0) {
          body = JSON.stringify(req.body);
        }
      }
    }

    // Faz a requisição para o backend com timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 segundos

    const fetchOptions: RequestInit = {
      method: req.method || 'GET',
      headers,
      signal: controller.signal,
    };

    if (body) {
      fetchOptions.body = body;
    }

    let response: Response;
    try {
      response = await fetch(backendUrl, fetchOptions);
      clearTimeout(timeoutId);
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        throw new Error('Timeout ao conectar com o servidor');
      }
      throw fetchError;
    }

    // Lê a resposta
    const contentType = response.headers.get('content-type') || '';
    let data: any = {};

    if (contentType.includes('application/json')) {
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        data = { message: 'Erro ao processar resposta JSON' };
      }
    } else {
      const text = await response.text();
      try {
        data = text ? JSON.parse(text) : { message: text || 'Resposta não JSON' };
      } catch {
        data = { message: text || 'Resposta não JSON' };
      }
    }

    const status = response.status;

    // Retorna a resposta com o mesmo status code e headers relevantes
    res.status(status).json(data);
  } catch (error: any) {
    console.error('Proxy error:', {
      message: error.message,
      url: backendUrl,
      method: req.method,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
    
    res.status(500).json({ 
      message: 'Erro ao conectar com o servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Erro interno do servidor'
    });
  }
}

