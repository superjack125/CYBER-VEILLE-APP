require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const logsRouter = require('./routes/logs');
const { getAlerts } = require('./alerts');
const authRouter = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/logs', logsRouter);
app.use('/api', authRouter);

app.get('/api/alerts', (req, res) => {
  const limit = parseInt(req.query.limit || '100', 10);
  getAlerts(limit, (err, rows) => {
    if (err) return res.status(500).json({ error: 'db_error' });
    res.json(rows || []);
  });
});

app.get('/', (req, res) => {
  res.json({ ok: true, message: 'Cyber monitor backend' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Backend listening on port ${PORT}`);
  });
}

module.exports = app;
