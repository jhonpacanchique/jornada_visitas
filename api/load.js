// GET /api/load — carga todos los datos desde MySQL
const { query } = require('./_db');

function saveTxt() {} // en Vercel no hay sistema de archivos persistente

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'GET') { res.status(405).end(); return; }

  try {
    const [empleados, clientes, visitas, cuentas] = await Promise.all([
      query('SELECT * FROM empleados ORDER BY id'),
      query('SELECT * FROM clientes ORDER BY id'),
      query('SELECT * FROM visitas ORDER BY entrada DESC'),
      query('SELECT * FROM cuentas ORDER BY id'),
    ]);
    res.status(200).json({ empleados, clientes, visitas, cuentas });
  } catch (e) {
    console.error('Error /api/load:', e.message);
    res.status(500).json({ error: e.message });
  }
};
