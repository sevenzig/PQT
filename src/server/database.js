// src/server/database.js
// version 1.02

const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function insertPurityResults(data) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (let item of data) {
      await client.query(
        'INSERT INTO purity_results (lot_id, test_date, description, specification, result, method, pass_fail, evaluation) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [item.lot_id, item.test_date, item.description, item.specification, item.result, item.method, item.pass_fail, item.evaluation]
      );
    }
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

async function insertPotencyResults(data) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (let item of data) {
      await client.query(
        'INSERT INTO potency_results (lot_id, test_date, strain, specification, result) VALUES ($1, $2, $3, $4, $5)',
        [item.lot_id, item.test_date, item.strain, item.specification, item.result]
      );
    }
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

async function insertActivityResults(data) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (let item of data) {
      await client.query(
        'INSERT INTO activity_results (lot_id, test_date, time_point, ph, lactic_acid_percentage) VALUES ($1, $2, $3, $4, $5)',
        [item.lot_id, item.test_date, item.time_point, item.ph, item.lactic_acid_percentage]
      );
    }
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

module.exports = { insertPurityResults, insertPotencyResults, insertActivityResults };