// Simple smoke test: POST a log and GET alerts
const http = require('http');

function postLog(payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const req = http.request(
      'http://localhost:4000/api/logs',
      { method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': data.length } },
      (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => resolve({ status: res.statusCode, body: body }));
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function getAlerts() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:4000/api/alerts', (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => resolve({ status: res.statusCode, body }));
    }).on('error', reject);
  });
}

async function run() {
  console.log('Run backend before executing this smoke test:');
  console.log('  cd backend; npm start');
  try {
    const post = await postLog({ ip: '198.51.100.7', message: 'smoke test login', level: 'info' });
    console.log('POST /api/logs ->', post.status, post.body);
    const alerts = await getAlerts();
    console.log('GET /api/alerts ->', alerts.status, alerts.body);
  } catch (err) {
    console.error('Smoke test failed:', err.message || err);
    process.exit(2);
  }
}

if (require.main === module) run();
