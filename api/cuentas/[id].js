const { query } = require('../_db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  const { id } = req.query;

  try {
    if (req.method === 'PUT') {
      const { rol, emp_id, password } = req.body;
      let q, vals;
      if (password) {
        q = 'UPDATE cuentas SET rol=$1, emp_id=$2, password=$3 WHERE id=$4 RETURNING *';
        vals = [rol, emp_id || null, password, id];
      } else {
        q = 'UPDATE cuentas SET rol=$1, emp_id=$2 WHERE id=$3 RETURNING *';
        vals = [rol, emp_id || null, id];
      }
      const rows = await query(q, vals);
      return res.status(200).json(rows[0]);
    }
    if (req.method === 'DELETE') {
      await query('DELETE FROM cuentas WHERE id=$1', [id]);
      return res.status(200).json({ ok: true });
    }
    res.status(405).end();
  } catch (e) {
    console.error('Error /api/cuentas/[id]:', e.message);
    res.status(500).json({ error: e.message });
  }
};
