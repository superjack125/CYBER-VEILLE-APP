const db = require('./db');

const RATE_THRESHOLD = parseInt(process.env.RATE_THRESHOLD || '10', 10);
const RATE_WINDOW_MS = parseInt(process.env.RATE_WINDOW_MS || '60000', 10);

// in-memory counters: { ip: [timestamps...] }
const counters = new Map();

// record a log and evaluate rules; returns alert object or null
function processLog(log) {
  const now = Date.now();
  const ip = log.ip;

  // blacklist example
  const blacklist = new Set(['203.0.113.5']);
  if (blacklist.has(ip)) {
    const alert = { timestamp: now, ip, reason: 'blacklist' };
    persistAlert(alert);
    return alert;
  }

  // rate-based detection
  const entry = counters.get(ip) || [];
  // keep only recent entries
  const windowStart = now - RATE_WINDOW_MS;
  const recent = entry.filter((t) => t >= windowStart);
  recent.push(now);
  counters.set(ip, recent);

  if (recent.length >= RATE_THRESHOLD) {
    const alert = { timestamp: now, ip, reason: `rate>=${RATE_THRESHOLD}` };
    persistAlert(alert);
    // reset counters to avoid duplicate floods
    counters.set(ip, []);
    return alert;
  }

  return null;
}

function persistAlert(alert) {
  db.run(
    'INSERT INTO alerts (timestamp, ip, reason) VALUES (?, ?, ?)',
    [alert.timestamp, alert.ip, alert.reason]
  );
}

function getAlerts(limit = 100, cb) {
  db.all('SELECT * FROM alerts ORDER BY timestamp DESC LIMIT ?', [limit], (err, rows) => {
    cb(err, rows || []);
  });
}

module.exports = { processLog, getAlerts };
