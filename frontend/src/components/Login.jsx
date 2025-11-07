import React, { useState } from 'react'

export function Login({ onLogin, onForgot }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  function handleSubmit(e) {
    e.preventDefault()
    if (username && password) {
      localStorage.setItem('cv_user', username)
      onLogin(username)
    } else {
      setError('Username and password required')
    }
  }

  return (
    <div className="cv-login-bg">
      <form className="cv-login-form" onSubmit={handleSubmit}>
        <h2>Cyber Monitor Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          autoFocus
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        <div style={{ marginTop: 10, textAlign: 'center' }}>
          <button type="button" style={{ color: '#2196f3', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }} onClick={onForgot}>Forgot Password?</button>
        </div>
        {error && <div className="cv-login-error">{error}</div>}
      </form>
    </div>
  )
}
