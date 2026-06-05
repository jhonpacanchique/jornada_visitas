// /api/cuentas       → POST (crear)
// /api/cuentas/[id]  → PUT (editar), DELETE (eliminar)
const { query, queryOne } = require('./_db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  const parts = req.url.split('/').filter(Boolean);
  const id = parts[1] ? parseInt(parts[1]) : null;

  try {

    // ── POST /api/cuentas — crear ──
    if (req.method === 'POST' && !id) {
      const { username, password, rol, emp_id } = req.body;
      const [result] = await query(
        'INSERT INTO cuentas (username, password, rol, emp_id) VALUES (?, ?, ?, ?)',
        [username, password, rol || 'rep', emp_id || null]
      );
      const row = await queryOne('SELECT * FROM cuentas WHERE id=?', [result.insertId]);
      return res.status(200).json(row);
    }

    // ── PUT /api/cuentas/[id] — editar ──
    if (req.method === 'PUT' && id) {
      const { rol, emp_id, password } = req.body;
      const sets = ['rol=?', 'emp_id=?'];
      const vals = [rol, emp_id || null];
      if (password) { sets.push('password=?'); vals.push(password); }
      vals.push(id);
      await query(`UPDATE cuentas SET ${sets.join(',')} WHERE id=?`, vals);
      const row = await queryOne('SELECT * FROM cuentas WHERE id=?', [id]);
      return res.status(200).json(row);
    }

    // ── DELETE /api/cuentas/[id] — eliminar ──
    if (req.method === 'DELETE' && id) {
      await query('DELETE FROM cuentas WHERE id=?', [id]);
      return res.status(200).json({ ok: true });
    }

    res.status(405).end();

  } catch (e) {
    console.error('Error /api/cuentas:', e.message);
    res.status(500).json({ error: e.message });
  }
};
