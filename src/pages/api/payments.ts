import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
    const apiRes = await fetch(`${backendUrl}/payments`, {
      headers: {
        'Content-Type': 'application/json',
        // Optionally: pass auth token if required
      },
    });
    if (!apiRes.ok) {
      const text = await apiRes.text();
      return res.status(apiRes.status).json({ message: text });
    }
    const data = await apiRes.json();
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
}
