const { query } = require('../_db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  const { id } = req.query;

  try {
    if (req.method === 'PUT') {
      const { nombre, cargo } = req.body;
      const rows = await query(
        'UPDATE empleados SET nombre=$1, cargo=$2 WHERE id=$3 RETURNING *',
        [nombre, cargo, id]
      );
      return res.status(200).json(rows[0]);
    }
    if (req.method === 'DELETE') {
      await query('DELETE FROM empleados WHERE id=$1', [id]);
      return res.status(200).json({ ok: true });
    }
    res.status(405).end();
  } catch (e) {
    console.error('Error /api/empleados/[id]:', e.message);
    res.status(500).json({ error: e.message });
  }
};
