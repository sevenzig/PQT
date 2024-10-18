// /src/server/auth.js
// version 1.01

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const SECRET_KEY = process.env.JWT_SECRET;

function generateToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
}

module.exports = { generateToken };