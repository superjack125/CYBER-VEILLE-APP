const express = require('express');
const router = express.Router();
const db = require('../db');
const { processLog } = require('../alerts');

// require API key for ingestion when configured
function requireApiKey(req, res, next) {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return next(); // not configured -> allow
  const key = req.headers['x-api-key'] || req.query.api_key;
  if (!key || key !== apiKey) return res.status(401).json({ error: 'unauthorized' });
  return next();
}

// ingest a log
router.post('/', requireApiKey, (req, res) => {
  const { timestamp = Date.now(), ip, message, level = 'info' } = req.body || {};
  if (!ip || !message) return res.status(400).json({ error: 'ip and message required' });

  db.run(
    'INSERT INTO logs (timestamp, ip, message, level) VALUES (?, ?, ?, ?)',
    [timestamp, ip, message, level],
    function (err) {
      if (err) return res.status(500).json({ error: 'db_error' });
      const inserted = { id: this.lastID, timestamp, ip, message, level };
      // evaluate alert rules (sync)
      const alert = processLog(inserted);
      return res.status(201).json({ ok: true, inserted, alert });
    }
  );
});

// list recent logs
router.get('/', (req, res) => {
  const limit = parseInt(req.query.limit || '100', 10);
  db.all('SELECT * FROM logs ORDER BY timestamp DESC LIMIT ?', [limit], (err, rows) => {
    if (err) return res.status(500).json({ error: 'db_error' });
    res.json(rows || []);
  });
});

module.exports = router;
