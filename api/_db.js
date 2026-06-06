// ── Conexión a Vercel Postgres ────────────────────────────
// Usa el driver oficial @vercel/postgres
// Las variables de entorno las agrega Vercel automáticamente

const { sql } = require('@vercel/postgres');

async function query(text, params = []) {
  const result = await sql.query(text, params);
  return result.rows;
}

async function queryOne(text, params = []) {
  const rows = await query(text, params);
  return rows[0] || null;
}

module.exports = { sql, query, queryOne };
