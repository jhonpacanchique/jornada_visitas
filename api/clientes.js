// /api/clientes — POST, PUT, DELETE
const { query } = require('./_db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  const parts = req.url.split('/').filter(Boolean);
  const id = parts[1] ? parseInt(parts[1]) : null;

  try {
    if (req.method === 'POST' && !id) {
      const { nombre, contacto, direccion } = req.body;
      const rows = await query(
        'INSERT INTO clientes (nombre, contacto, direccion) VALUES ($1, $2, $3) RETURNING *',
        [nombre, contacto || '—', direccion || 'Sin dirección']
      );
      return res.status(200).json(rows[0]);
    }
    if (req.method === 'PUT' && id) {
      const { nombre, contacto, direccion } = req.body;
      const rows = await query(
        'UPDATE clientes SET nombre=$1, contacto=$2, direccion=$3 WHERE id=$4 RETURNING *',
        [nombre, contacto, direccion, id]
      );
      return res.status(200).json(rows[0]);
    }
    if (req.method === 'DELETE' && id) {
      await query('DELETE FROM clientes WHERE id=$1', [id]);
      return res.status(200).json({ ok: true });
    }
    res.status(405).end();
  } catch (e) {
    console.error('Error /api/clientes:', e.message);
    res.status(500).json({ error: e.message });
  }
};
