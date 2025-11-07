import React, { useState } from 'react';

export function Register({ onRegister, onSwitch }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess(false);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setSuccess(true);
        onRegister(data.user);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Network error');
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 340, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #2196f308' }}>
      <h2>Create Account</h2>
      <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required style={{ width: '100%', marginBottom: 12, padding: 8 }} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', marginBottom: 12, padding: 8 }} />
      <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        Password must be at least 8 characters, include uppercase, lowercase, digit, and special character.
      </div>
      <button type="submit" style={{ width: '100%', padding: 10, background: '#4caf50', color: '#fff', border: 'none', borderRadius: 4 }}>Register</button>
      <div style={{ marginTop: 12, textAlign: 'center' }}>
        <span>Already have an account? <button type="button" style={{ color: '#2196f3', background: 'none', border: 'none', cursor: 'pointer' }} onClick={onSwitch}>Login</button></span>
      </div>
      {error && <div style={{ color: '#f44336', marginTop: 10 }}>{error}</div>}
      {success && <div style={{ color: '#4caf50', marginTop: 10 }}>Account created! Logging in...</div>}
    </form>
  );
}
