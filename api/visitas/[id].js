const { query } = require('../_db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  const { id } = req.query;

  try {
    if (req.method === 'PUT') {
      const b = req.body;
      const sets = [];
      const vals = [];
      let i = 1;
      if (b.salida     !== undefined) { sets.push(`salida=$${i++}`);     vals.push(b.salida); }
      if (b.salida_lat !== undefined) { sets.push(`salida_lat=$${i++}`); vals.push(b.salida_lat); }
      if (b.salida_lng !== undefined) { sets.push(`salida_lng=$${i++}`); vals.push(b.salida_lng); }
      if (b.emp_id     !== undefined) { sets.push(`emp_id=$${i++}`);     vals.push(b.emp_id); }
      if (b.cliente_id !== undefined) { sets.push(`cliente_id=$${i++}`); vals.push(b.cliente_id); }
      if (b.objetivo   !== undefined) { sets.push(`objetivo=$${i++}`);   vals.push(b.objetivo); }
      if (b.entrada    !== undefined) { sets.push(`entrada=$${i++}`);    vals.push(b.entrada); }
      if (sets.length) {
        vals.push(id);
        const rows = await query(
          `UPDATE visitas SET ${sets.join(',')} WHERE id=$${i} RETURNING *`, vals
        );
        return res.status(200).json(rows[0]);
      }
      return res.status(400).json({ error: 'Sin campos para actualizar' });
    }
    res.status(405).end();
  } catch (e) {
    console.error('Error /api/visitas/[id]:', e.message);
    res.status(500).json({ error: e.message });
  }
};
