// /api/clientes       → POST (crear)
// /api/clientes/[id]  → PUT (editar), DELETE (eliminar)
const { query, queryOne } = require('./_db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  const parts = req.url.split('/').filter(Boolean);
  const id = parts[1] ? parseInt(parts[1]) : null;

  try {

    // ── POST /api/clientes — crear ──
    if (req.method === 'POST' && !id) {
      const { nombre, contacto, direccion } = req.body;
      const [result] = await query(
        'INSERT INTO clientes (nombre, contacto, direccion) VALUES (?, ?, ?)',
        [nombre, contacto || '—', direccion || 'Sin dirección']
      );
      const row = await queryOne('SELECT * FROM clientes WHERE id=?', [result.insertId]);
      return res.status(200).json(row);
    }

    // ── PUT /api/clientes/[id] — editar ──
    if (req.method === 'PUT' && id) {
      const { nombre, contacto, direccion } = req.body;
      await query(
        'UPDATE clientes SET nombre=?, contacto=?, direccion=? WHERE id=?',
        [nombre, contacto, direccion, id]
      );
      const row = await queryOne('SELECT * FROM clientes WHERE id=?', [id]);
      return res.status(200).json(row);
    }

    // ── DELETE /api/clientes/[id] — eliminar ──
    if (req.method === 'DELETE' && id) {
      await query('DELETE FROM clientes WHERE id=?', [id]);
      return res.status(200).json({ ok: true });
    }

    res.status(405).end();

  } catch (e) {
    console.error('Error /api/clientes:', e.message);
    res.status(500).json({ error: e.message });
  }
};
