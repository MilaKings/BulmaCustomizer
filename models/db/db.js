const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'bulmacustomizer',
  password: 'corsola',
  port: 5432,
});

module.exports = pool;
