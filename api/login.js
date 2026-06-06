// POST /api/login
const { queryOne } = require('./_db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'POST') { res.status(405).end(); return; }
  try {
    const { username, password } = req.body;
    const row = await queryOne(
      'SELECT * FROM cuentas WHERE username=$1 AND password=$2',
      [username, password]
    );
    res.status(200).json(row || null);
  } catch (e) {
    console.error('Error /api/login:', e.message);
    res.status(500).json({ error: e.message });
  }
};
