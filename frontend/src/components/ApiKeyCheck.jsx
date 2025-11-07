import React, { useState } from 'react'

export function ApiKeyCheck({ onSave }) {
  const [key, setKey] = useState(localStorage.getItem('api_key') || '')
  const [status, setStatus] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      // Test the key with a simple log post
      const res = await fetch('http://localhost:4000/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': key
        },
        body: JSON.stringify({
          ip: '127.0.0.1',
          message: 'api key test',
          level: 'info'
        })
      })
      if (res.ok) {
        localStorage.setItem('api_key', key)
        setStatus('success')
        onSave(key)
      } else {
        setStatus('error')
      }
    } catch (err) {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '20px auto', padding: 20 }}>
      <h2>API Key Check</h2>
      <div style={{ marginBottom: 10 }}>
        <input
          type="text"
          value={key}
          onChange={e => setKey(e.target.value)}
          placeholder="Enter API key"
          style={{ width: '100%', padding: 8 }}
        />
      </div>
      <button type="submit" style={{ padding: '8px 16px' }}>Verify & Save</button>
      {status === 'success' && (
        <div style={{ color: 'green', marginTop: 10 }}>✓ API key verified</div>
      )}
      {status === 'error' && (
        <div style={{ color: 'red', marginTop: 10 }}>✗ Invalid API key</div>
      )}
    </form>
  )
}