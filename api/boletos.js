const store = globalThis.__boletosStore || (globalThis.__boletosStore = {
  taken: [],
  records: [],
});

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';

    req.on('data', chunk => {
      raw += chunk;
    });

    req.on('end', () => {
      if (!raw) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve({ raw });
      }
    });

    req.on('error', reject);
  });
}

function normalizeNums(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map(n => Number.parseInt(n, 10))
    .filter(n => Number.isInteger(n) && n >= 0 && n <= 999);
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method === 'GET') {
    res.status(200).json({
      ok: true,
      taken: store.taken,
      records: store.records,
    });
    return;
  }

  if (req.method === 'POST') {
    const body = await parseBody(req);
    const nums = normalizeNums(body.nums);

    if (nums.length === 0) {
      res.status(400).json({
        ok: false,
        error: 'Faltan numeros validos en el cuerpo de la peticion.',
      });
      return;
    }

    for (const num of nums) {
      if (!store.taken.includes(num)) {
        store.taken.push(num);
      }
    }

    const record = {
      name: body.name || '',
      phone: body.phone || '',
      nums,
      folio: body.folio || '',
      date: body.date || '',
      tipo: body.tipo ?? null,
      receivedAt: new Date().toISOString(),
    };

    store.records.push(record);

    res.status(200).json({
      ok: true,
      saved: record,
      taken: store.taken,
    });
    return;
  }

  res.setHeader('Allow', 'GET,POST,OPTIONS');
  res.status(405).json({
    ok: false,
    error: 'Metodo no permitido',
  });
}