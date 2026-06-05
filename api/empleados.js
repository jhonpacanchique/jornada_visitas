// /api/empleados       → POST (crear)
// /api/empleados/[id]  → PUT (editar), DELETE (eliminar)
const { query, queryOne } = require('./_db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  // Extraer ID de la URL si viene /api/empleados/123
  const parts = req.url.split('/').filter(Boolean);
  const id = parts[1] ? parseInt(parts[1]) : null;

  try {

    // ── POST /api/empleados — crear ──
    if (req.method === 'POST' && !id) {
      const { nombre, cargo } = req.body;
      const [result] = await query(
        'INSERT INTO empleados (nombre, cargo) VALUES (?, ?)',
        [nombre, cargo || 'Representante']
      );
      const row = await queryOne('SELECT * FROM empleados WHERE id=?', [result.insertId]);
      return res.status(200).json(row);
    }

    // ── PUT /api/empleados/[id] — editar ──
    if (req.method === 'PUT' && id) {
      const { nombre, cargo } = req.body;
      await query('UPDATE empleados SET nombre=?, cargo=? WHERE id=?', [nombre, cargo, id]);
      const row = await queryOne('SELECT * FROM empleados WHERE id=?', [id]);
      return res.status(200).json(row);
    }

    // ── DELETE /api/empleados/[id] — eliminar ──
    if (req.method === 'DELETE' && id) {
      await query('DELETE FROM empleados WHERE id=?', [id]);
      return res.status(200).json({ ok: true });
    }

    res.status(405).end();

  } catch (e) {
    console.error('Error /api/empleados:', e.message);
    res.status(500).json({ error: e.message });
  }
};
