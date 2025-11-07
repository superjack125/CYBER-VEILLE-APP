import React, { useState } from 'react';

export function MFALogin({ username, onLogin }) {
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, mfa_token: token })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        onLogin(data.user);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 340, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #2196f308' }}>
      <h2>MFA Login</h2>
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', marginBottom: 12, padding: 8 }} />
      <input type="text" placeholder="MFA Code" value={token} onChange={e => setToken(e.target.value)} required style={{ width: '100%', marginBottom: 12, padding: 8 }} />
      <button type="submit" style={{ width: '100%', padding: 10, background: '#2196f3', color: '#fff', border: 'none', borderRadius: 4 }}>Login</button>
      {error && <div style={{ color: '#f44336', marginTop: 10 }}>{error}</div>}
    </form>
  );
}
