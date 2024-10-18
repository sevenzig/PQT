// src/server/database.js
// version 1.02

// Import the Pool class from the 'pg' (PostgreSQL) module
const { Pool } = require('pg');

// Create a new database connection pool using environment variables for configuration
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

/**
 * Insert purity test results into the database
 * @param {Array} data - An array of purity test result objects
 */
async function insertPurityResults(data) {
  const client = await pool.connect();
  try {
    // Start a transaction
    await client.query('BEGIN');
    // Insert each item in the data array
    for (let item of data) {
      await client.query(
        'INSERT INTO purity_results (lot_id, test_date, description, specification, result, method, pass_fail, evaluation) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [item.lot_id, item.test_date, item.description, item.specification, item.result, item.method, item.pass_fail, item.evaluation]
      );
    }
    // Commit the transaction
    await client.query('COMMIT');
  } catch (e) {
    // If an error occurs, rollback the transaction
    await client.query('ROLLBACK');
    throw e;
  } finally {
    // Release the client back to the pool
    client.release();
  }
}

/**
 * Insert potency test results into the database
 * @param {Array} data - An array of potency test result objects
 */
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

/**
 * Insert activity test results into the database
 * @param {Array} data - An array of activity test result objects
 */
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

// Export the functions for use in other modules
module.exports = { insertPurityResults, insertPotencyResults, insertActivityResults };
