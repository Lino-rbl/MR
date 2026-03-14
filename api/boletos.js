// api/boletos.js  ← sube esto a tu repo de Vercel
// Vercel Serverless Function — Node.js
//
// Guarda cada boleto en un archivo JSON dentro de /tmp (Vercel)
// o puedes conectar una base de datos real (ver comentarios al final).

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

// En Vercel, /tmp es el único directorio escribible entre invocaciones cortas.
// Para persistencia real usa: PlanetScale, Supabase, MongoDB Atlas, etc.
const DB_PATH = join('/tmp', 'boletos.json');

function readDB() {
  if (!existsSync(DB_PATH)) return [];
  try {
    return JSON.parse(readFileSync(DB_PATH, 'utf8'));
  } catch {
    return [];
  }
}

function writeDB(data) {
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

export default function handler(req, res) {
  // ── CORS: permite peticiones desde GitHub Pages ──
  res.setHeader('Access-Control-Allow-Origin', '*');          // cambia * por tu dominio en producción
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ── POST /api/boletos — guardar un boleto nuevo ──
  if (req.method === 'POST') {
    const { name, nums, folio, date } = req.body;

    if (!name || !Array.isArray(nums) || nums.length !== 4 || !folio) {
      return res.status(400).json({ error: 'Datos incompletos.' });
    }

    const db = readDB();

    // Verificar que ningún número ya esté tomado
    const duplicates = nums.filter(n => db.some(b => b.nums.includes(n)));
    if (duplicates.length > 0) {
      return res.status(409).json({
        error: 'Uno o más números ya están tomados.',
        duplicates,
      });
    }

    const entry = {
      folio,
      name:      name.trim(),
      nums,
      date,
      createdAt: new Date().toISOString(),
    };

    db.push(entry);
    writeDB(db);

    return res.status(201).json({ ok: true, folio });
  }

  // ── GET /api/boletos — listar todos los boletos (admin) ──
  if (req.method === 'GET') {
    // 🔐 Protege este endpoint con un token secreto
    const token = req.headers['x-admin-token'];
    if (token !== process.env.ADMIN_TOKEN) {
      return res.status(401).json({ error: 'No autorizado.' });
    }

    const db = readDB();
    return res.status(200).json(db);
  }

  return res.status(405).json({ error: 'Método no permitido.' });
}

/* ──────────────────────────────────────────────────────────────
   OPCIONAL: Reemplaza readDB/writeDB con una base de datos real.
   
   Ejemplo con Supabase (recomendado para Vercel):

   import { createClient } from '@supabase/supabase-js';
   const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

   // Insertar:
   await supabase.from('boletos').insert([entry]);

   // Leer todos:
   const { data } = await supabase.from('boletos').select('*');

   Tabla SQL mínima:
   CREATE TABLE boletos (
     id         SERIAL PRIMARY KEY,
     folio      TEXT UNIQUE,
     name       TEXT,
     nums       INTEGER[],
     date       TEXT,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
────────────────────────────────────────────────────────────── */