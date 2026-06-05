// /api/visitas       → POST (crear entrada)
// /api/visitas/[id]  → PUT (actualizar / registrar salida)
const { query, queryOne } = require('./_db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  const parts = req.url.split('/').filter(Boolean);
  const id = parts[1] ? parseInt(parts[1]) : null;

  try {

    // ── POST /api/visitas — registrar entrada ──
    if (req.method === 'POST' && !id) {
      const { visit_id, emp_id, cliente_id, objetivo, entrada,
              entrada_lat, entrada_lng, entrada_acc } = req.body;
      const [result] = await query(
        `INSERT INTO visitas
         (visit_id, emp_id, cliente_id, objetivo, entrada,
          entrada_lat, entrada_lng, entrada_acc)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [visit_id, emp_id, cliente_id, objetivo,
         entrada || new Date(),
         entrada_lat || null, entrada_lng || null, entrada_acc || null]
      );
      const row = await queryOne('SELECT * FROM visitas WHERE id=?', [result.insertId]);
      return res.status(200).json(row);
    }

    // ── PUT /api/visitas/[id] — registrar salida o editar ──
    if (req.method === 'PUT' && id) {
      const b = req.body;
      const sets = [];
      const vals = [];
      if (b.salida     !== undefined) { sets.push('salida=?');     vals.push(b.salida); }
      if (b.salida_lat !== undefined) { sets.push('salida_lat=?'); vals.push(b.salida_lat); }
      if (b.salida_lng !== undefined) { sets.push('salida_lng=?'); vals.push(b.salida_lng); }
      if (b.emp_id     !== undefined) { sets.push('emp_id=?');     vals.push(b.emp_id); }
      if (b.cliente_id !== undefined) { sets.push('cliente_id=?'); vals.push(b.cliente_id); }
      if (b.objetivo   !== undefined) { sets.push('objetivo=?');   vals.push(b.objetivo); }
      if (b.entrada    !== undefined) { sets.push('entrada=?');    vals.push(b.entrada); }
      if (sets.length) {
        vals.push(id);
        await query(`UPDATE visitas SET ${sets.join(',')} WHERE id=?`, vals);
      }
      const row = await queryOne('SELECT * FROM visitas WHERE id=?', [id]);
      return res.status(200).json(row);
    }

    res.status(405).end();

  } catch (e) {
    console.error('Error /api/visitas:', e.message);
    res.status(500).json({ error: e.message });
  }
};
