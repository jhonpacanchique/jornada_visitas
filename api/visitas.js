// /api/visitas — POST, PUT
const { query } = require('./_db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  const parts = req.url.split('/').filter(Boolean);
  const id = parts[1] ? parseInt(parts[1]) : null;

  try {
    if (req.method === 'POST' && !id) {
      const { visit_id, emp_id, cliente_id, objetivo, entrada,
              entrada_lat, entrada_lng, entrada_acc } = req.body;
      const rows = await query(
        `INSERT INTO visitas (visit_id, emp_id, cliente_id, objetivo, entrada,
          entrada_lat, entrada_lng, entrada_acc)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
        [visit_id, emp_id, cliente_id, objetivo,
         entrada || new Date().toISOString(),
         entrada_lat || null, entrada_lng || null, entrada_acc || null]
      );
      return res.status(200).json(rows[0]);
    }
    if (req.method === 'PUT' && id) {
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
    console.error('Error /api/visitas:', e.message);
    res.status(500).json({ error: e.message });
  }
};
