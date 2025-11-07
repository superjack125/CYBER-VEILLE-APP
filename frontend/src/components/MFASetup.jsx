import React, { useState } from 'react';

export function MFASetup({ userId, onEnabled }) {
  const [qr, setQr] = useState(null);
  const [secret, setSecret] = useState('');
  const [token, setToken] = useState('');
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');

  async function startSetup() {
    setError('');
    const res = await fetch('/api/auth/mfa/setup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    const data = await res.json();
    if (data.qr) {
      setQr(data.qr);
      setSecret(data.secret);
      setStep(1);
    } else {
      setError(data.error || 'Failed to start MFA setup');
    }
  }

  async function verifyToken() {
    setError('');
    const res = await fetch('/api/auth/mfa/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, token })
    });
    const data = await res.json();
    if (data.success) {
      setStep(2);
      onEnabled && onEnabled();
    } else {
      setError(data.error || 'Invalid token');
    }
  }

  return (
    <div style={{ background: '#232526', color: '#fafafa', borderRadius: 10, boxShadow: '0 2px 8px #0006', padding: 16, maxWidth: 340, margin: '24px auto', border: '1px solid #333' }}>
      <h3 style={{ color: '#90caf9', fontSize: 17, marginBottom: 10 }}>Multi-Factor Authentication Setup</h3>
      {step === 0 && (
        <button onClick={startSetup} style={{ padding: '8px 16px', background: '#2196f3', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>Start MFA Setup</button>
      )}
      {step === 1 && (
        <div>
          <div style={{ marginBottom: 12 }}>
            <img src={qr} alt="MFA QR" style={{ width: 180, height: 180, background: '#fff', borderRadius: 8 }} />
            <div style={{ fontSize: 13, marginTop: 8 }}>Scan with Google Authenticator or similar app.</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>Secret: <span style={{ fontWeight: 600 }}>{secret}</span></div>
          </div>
          <input
            type="text"
            value={token}
            onChange={e => setToken(e.target.value)}
            placeholder="Enter code from app"
            style={{ width: '100%', padding: 8, marginBottom: 8, borderRadius: 6, border: '1px solid #444', fontSize: 15 }}
          />
          <button onClick={verifyToken} style={{ padding: '8px 16px', background: '#4caf50', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>Verify & Enable</button>
        </div>
      )}
      {step === 2 && (
        <div style={{ color: '#4caf50', fontWeight: 600 }}>MFA enabled! 🎉</div>
      )}
      {error && <div style={{ color: '#f44336', marginTop: 10 }}>{error}</div>}
    </div>
  );
}
