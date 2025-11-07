import React, { useState } from 'react'
import { postLog } from '../api'

export function LogSimulator() {
  const [form, setForm] = useState({
    ip: '',
    message: '',
    level: 'info'
  })
  const [status, setStatus] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      await postLog(form)
      setStatus('success')
      // Clear form except level
      setForm(f => ({ ...f, ip: '', message: '' }))
      setTimeout(() => setStatus(null), 2000)
    } catch (err) {
      setStatus('error')
    }
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '20px auto', padding: 20, border: '1px solid #ddd' }}>
      <h3>Simulate Log Entry</h3>
      <div style={{ marginBottom: 10 }}>
        <input
          type="text"
          name="ip"
          value={form.ip}
          onChange={handleChange}
          placeholder="IP address (e.g., 192.168.1.1)"
          style={{ width: '100%', padding: 8, marginBottom: 8 }}
          required
        />
        <input
          type="text"
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Log message"
          style={{ width: '100%', padding: 8, marginBottom: 8 }}
          required
        />
        <select
          name="level"
          value={form.level}
          onChange={handleChange}
          style={{ width: '100%', padding: 8 }}
        >
          <option value="info">Info</option>
          <option value="warning">Warning</option>
          <option value="error">Error</option>
        </select>
      </div>
      <button type="submit" style={{ padding: '8px 16px' }}>Send Log</button>
      {status === 'success' && (
        <div style={{ color: 'green', marginTop: 10 }}>✓ Log sent</div>
      )}
      {status === 'error' && (
        <div style={{ color: 'red', marginTop: 10 }}>✗ Failed to send log</div>
      )}
    </form>
  )
}