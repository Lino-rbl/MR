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

  // ── POST: guardar boleto ──────────────────────────────────────────────────
  if (req.method === 'POST') {
    const { name, phone, nums, folio, date, tipo } = req.body;

    const tipoValido = tipo === 2 || tipo === 4;

    if (!name || !phone || !Array.isArray(nums) || !folio || !tipoValido) {
      return res.status(400).json({ error: 'Datos incompletos.' });
    }

    if (nums.length !== tipo) {
      return res.status(400).json({
        error: `Un boleto de tipo ${tipo} debe llevar exactamente ${tipo} números.`
      });
    }

    // Insertar directamente — Supabase lanzará error si hay duplicado
    // gracias al constraint único en la columna nums (ver nota abajo)
    const { error } = await supabase
      .from('boletos')
      .insert([{ folio, name, phone, nums, date, tipo }]);

    if (error) {
      // Conflicto de folio duplicado (muy raro pero posible)
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Folio duplicado, intenta de nuevo.' });
      }
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ ok: true, folio });
  }

  // ── GET ?taken=true : lista de números ocupados ───────────────────────────
  if (req.method === 'GET' && req.query.taken === 'true') {
    const { data, error } = await supabase
      .from('boletos')
      .select('nums');

    if (error) return res.status(500).json({ error: error.message });

    const taken = data.flatMap(b => b.nums);
    return res.status(200).json({ taken });
  }

  // ── GET admin ─────────────────────────────────────────────────────────────
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