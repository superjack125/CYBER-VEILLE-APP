const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const crypto = require('crypto');

// Request password reset (generates code)
router.post('/password/request', (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'Username required' });
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err || !user) return res.status(404).json({ error: 'User not found' });
    const code = crypto.randomBytes(4).toString('hex');
    db.run('UPDATE users SET reset_code = ? WHERE id = ?', [code, user.id], err2 => {
      if (err2) return res.status(500).json({ error: 'Failed to set reset code' });
      // In real app, send code via email. Here, return code for demo.
      res.json({ code });
    });
  });
});

// Reset password with code
router.post('/password/reset', (req, res) => {
  const { username, code, newPassword } = req.body;
  if (!username || !code || !newPassword) return res.status(400).json({ error: 'All fields required' });
  if (!isStrongPassword(newPassword)) return res.status(400).json({ error: 'Password must be at least 8 characters, include uppercase, lowercase, digit, and special character.' });
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err || !user) return res.status(404).json({ error: 'User not found' });
    if (user.reset_code !== code) return res.status(401).json({ error: 'Invalid reset code' });
    const hash = bcrypt.hashSync(newPassword, 10);
    db.run('UPDATE users SET password = ?, reset_code = NULL WHERE id = ?', [hash, user.id], err2 => {
      if (err2) return res.status(500).json({ error: 'Failed to reset password' });
      res.json({ success: true });
    });
  });
});
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

// Ensure users table exists
if (db) {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);
}

function isStrongPassword(pw) {
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(pw);
}

router.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
  if (!isStrongPassword(password)) return res.status(400).json({ error: 'Password must be at least 8 characters, include uppercase, lowercase, digit, and special character.' });
  const hash = bcrypt.hashSync(password, 10);
  db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], function (err) {
    if (err) return res.status(400).json({ error: 'Username already exists' });
    const user = { id: this.lastID, username, mfa_enabled: 0 };
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '2h' });
    res.json({ user, token });
  });
});

// MFA setup endpoint
router.post('/mfa/setup', (req, res) => {
  const { userId } = req.body;
  db.get('SELECT * FROM users WHERE id = ?', [userId], (err, user) => {
    if (err || !user) return res.status(404).json({ error: 'User not found' });
    const secret = speakeasy.generateSecret({ length: 20, name: `CyberVeille:${user.username}` });
    db.run('UPDATE users SET mfa_secret = ? WHERE id = ?', [secret.base32, userId], err2 => {
      if (err2) return res.status(500).json({ error: 'Failed to save secret' });
      qrcode.toDataURL(secret.otpauth_url, (err3, imageUrl) => {
        if (err3) return res.status(500).json({ error: 'Failed to generate QR' });
        res.json({ secret: secret.base32, otpauth_url: secret.otpauth_url, qr: imageUrl });
      });
    });
  });
});

// MFA verify endpoint
router.post('/mfa/verify', (req, res) => {
  const { userId, token } = req.body;
  db.get('SELECT * FROM users WHERE id = ?', [userId], (err, user) => {
    if (err || !user || !user.mfa_secret) return res.status(404).json({ error: 'User or secret not found' });
    const verified = speakeasy.totp.verify({
      secret: user.mfa_secret,
      encoding: 'base32',
      token
    });
    if (verified) {
      db.run('UPDATE users SET mfa_enabled = 1 WHERE id = ?', [userId]);
      return res.json({ success: true });
    }
    res.status(401).json({ error: 'Invalid MFA token' });
  });
});

router.post('/login', (req, res) => {
  const { username, password, mfa_token } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err || !user) return res.status(401).json({ error: 'Invalid credentials' });
    if (!bcrypt.compareSync(password, user.password)) return res.status(401).json({ error: 'Invalid credentials' });
    if (user.mfa_enabled) {
      if (!mfa_token) return res.status(401).json({ error: 'MFA token required' });
      const verified = speakeasy.totp.verify({
        secret: user.mfa_secret,
        encoding: 'base32',
        token: mfa_token
      });
      if (!verified) return res.status(401).json({ error: 'Invalid MFA token' });
    }
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ user: { id: user.id, username: user.username, mfa_enabled: user.mfa_enabled }, token });
  });
});

module.exports = router;
