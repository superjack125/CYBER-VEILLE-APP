import React, { useState } from 'react';

export function PasswordReset({ onSwitch }) {
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resetCode, setResetCode] = useState('');

  async function requestReset(e) {
    e.preventDefault();
    setError('');
  const res = await fetch('/api/password/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });
    const data = await res.json();
    if (res.ok && data.code) {
      setResetCode(data.code);
      setStep(1);
    } else {
      setError(data.error || 'Request failed');
    }
  }

  async function resetPassword(e) {
    e.preventDefault();
    setError('');
  const res = await fetch('/api/password/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, code, newPassword })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      setSuccess(true);
    } else {
      setError(data.error || 'Reset failed');
    }
  }

  return (
    <div style={{ maxWidth: 340, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #2196f308' }}>
      <h2>Password Reset</h2>
      {step === 0 && (
        <form onSubmit={requestReset}>
          <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required style={{ width: '100%', marginBottom: 12, padding: 8 }} />
          <button type="submit" style={{ width: '100%', padding: 10, background: '#2196f3', color: '#fff', border: 'none', borderRadius: 4 }}>Request Reset</button>
          {resetCode && <div style={{ fontSize: 13, color: '#888', marginTop: 8 }}>Demo: Your reset code is <b>{resetCode}</b></div>}
        </form>
      )}
      {step === 1 && (
        <form onSubmit={resetPassword}>
          <input type="text" placeholder="Reset Code" value={code} onChange={e => setCode(e.target.value)} required style={{ width: '100%', marginBottom: 12, padding: 8 }} />
          <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required style={{ width: '100%', marginBottom: 12, padding: 8 }} />
          <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
            Password must be at least 8 characters, include uppercase, lowercase, digit, and special character.
          </div>
          <button type="submit" style={{ width: '100%', padding: 10, background: '#4caf50', color: '#fff', border: 'none', borderRadius: 4 }}>Reset Password</button>
        </form>
      )}
      {success && <div style={{ color: '#4caf50', marginTop: 10 }}>Password reset! You can now login.</div>}
      {error && <div style={{ color: '#f44336', marginTop: 10 }}>{error}</div>}
      <div style={{ marginTop: 12, textAlign: 'center' }}>
        <button type="button" style={{ color: '#2196f3', background: 'none', border: 'none', cursor: 'pointer' }} onClick={onSwitch}>Back to Login</button>
      </div>
    </div>
  );
}
