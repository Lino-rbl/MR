import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-token');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const { name, phone, nums, folio, date } = req.body;

  if (!name || !phone || !Array.isArray(nums) || nums.length !== 4 || !folio) {
    return res.status(400).json({ error: 'Datos incompletos.' });
  }

    const { error } = await supabase
      .from('boletos')
      .insert([{ folio, name, phone, nums, date }]);

    if (error) {
      return res.status(409).json({ error: error.message });
    }

    return res.status(201).json({ ok: true, folio });
  }

    // Agrega este bloque ANTES del GET admin
  if (req.method === 'GET' && req.query.taken === 'true') {
    const { data, error } = await supabase
      .from('boletos')
      .select('nums');

    if (error) return res.status(500).json({ error: error.message });

    // Aplanar todos los arrays de nums en una sola lista
    const taken = data.flatMap(b => b.nums);
    return res.status(200).json({ taken });
  }

  if (req.method === 'GET') {
    const token = req.headers['x-admin-token'];
    if (token !== process.env.ADMIN_TOKEN) {
      return res.status(401).json({ error: 'No autorizado.' });
    }

    const { data, error } = await supabase
      .from('boletos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json(data);
  }

  return res.status(405).json({ error: 'Método no permitido.' });
}