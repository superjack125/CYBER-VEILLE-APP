import React, { useEffect, useState, useMemo } from 'react';
import { fetchLogs, fetchAlerts, getApiKey } from './api';
import { Login } from './components/Login';
import { PasswordReset } from './components/PasswordReset';
import { Register } from './components/Register';
import { MFASetup } from './components/MFASetup';
import { MFALogin } from './components/MFALogin';
import { ApiKeyCheck } from './components/ApiKeyCheck';
import { LogSimulator } from './components/LogSimulator';
import { LogFilter } from './components/LogFilter';
import { LogExport } from './components/LogExport';
import { StatsPanel } from './components/StatsPanel';
import { SecurityAnalyticsPanel } from './components/SecurityAnalyticsPanel';
import { LogsTimeChart } from './components/LogsTimeChart';
import { AlertsPieChart } from './components/AlertsPieChart';
import { CyberNewsPanel } from './components/CyberNewsPanel';
import { IncidentResponseTools } from './components/IncidentResponseTools';
import { EducationalWidget } from './components/EducationalWidget';
import { ThreatIntelPanel } from './components/ThreatIntelPanel';

export default function App() {
  const [logs, setLogs] = useState([])
  const [alerts, setAlerts] = useState([])
  const [apiKey, setApiKey] = useState(getApiKey())
  const [filters, setFilters] = useState({
    search: '',
    level: 'all',
    timeRange: '1h'
  })
  const [authPage, setAuthPage] = useState('login')
  const [user, setUser] = useState(null)
  const [pendingMFA, setPendingMFA] = useState(null)
  const [showReset, setShowReset] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    // Prefer system dark mode
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return true;
    return false;
  });

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    document.body.classList.toggle('light-mode', !darkMode);
  }, [darkMode]);

  async function load() {
    const [l, a] = await Promise.all([fetchLogs(), fetchAlerts()])
    setLogs(l)
    setAlerts(a)
  }

  useEffect(() => {
    if (user) {
      load()
      const iv = setInterval(load, 3000)
      return () => clearInterval(iv)
    }
  }, [user])

  // Apply filters to logs
  const filteredLogs = useMemo(() => {
    let filtered = [...logs]
    
    // Time range filter
    const now = Date.now()
    const ranges = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000
    }
    if (filters.timeRange !== 'all') {
      const cutoff = now - ranges[filters.timeRange]
      filtered = filtered.filter(l => l.timestamp >= cutoff)
    }

    // Level filter
    if (filters.level !== 'all') {
      filtered = filtered.filter(l => l.level === filters.level)
    }

    // Search filter (IP or message)
    if (filters.search) {
      const search = filters.search.toLowerCase()
      filtered = filtered.filter(l => 
        l.ip.toLowerCase().includes(search) ||
        l.message.toLowerCase().includes(search)
      )
    }

    return filtered
  }, [logs, filters])

  // Prepare chart data
  const charts = useMemo(() => {
    // Count logs by level
    const levelCounts = filteredLogs.reduce((acc, l) => {
      acc[l.level] = (acc[l.level] || 0) + 1
      return acc
    }, {})
    const logsByLevel = Object.entries(levelCounts).map(([label, value]) => ({ label, value }))

    // Count alerts by reason
    const alertCounts = alerts.reduce((acc, a) => {
      acc[a.reason] = (acc[a.reason] || 0) + 1
      return acc
    }, {})
    const alertsByReason = Object.entries(alertCounts).map(([label, value]) => ({ label, value }))

    return { logsByLevel, alertsByReason }
  }, [filteredLogs, alerts])

  if (!user) {
    if (pendingMFA) {
      return <MFALogin username={pendingMFA} onLogin={u => { setUser(u); setPendingMFA(null); setAuthPage('dashboard'); }} />;
    }
    if (showReset) {
      return <PasswordReset onSwitch={() => setShowReset(false)} />;
    }
    return authPage === 'login' ? (
      <Login 
        onLogin={u => {
          if (u && u.mfa_enabled) {
            setPendingMFA(u.username);
          } else {
            setUser(u);
            setAuthPage('dashboard');
          }
        }} 
        onSwitch={() => setAuthPage('register')} 
        onForgot={() => setShowReset(true)}
      />
    ) : (
      <Register 
        onRegister={u => {
          setUser(u);
          setAuthPage('dashboard');
        }} 
        onSwitch={() => setAuthPage('login')} 
      />
    )
  }

  // Show API key check if no key saved
  if (!apiKey) {
    return <ApiKeyCheck onSave={setApiKey} />
  }

  // Show MFA setup if user is logged in and MFA not enabled
  if (user && user.mfa_enabled === 0) {
    return <MFASetup userId={user.id} onEnabled={() => setUser({ ...user, mfa_enabled: 1 })} />;
  }

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 40 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <h1 style={{ fontFamily: 'Inter, Arial', fontWeight: 700, fontSize: 32, letterSpacing: 1 }}>Cyber Monitor Dashboard</h1>
          <button
            onClick={() => setDarkMode(d => !d)}
            style={{
              background: 'var(--card-bg)',
              color: 'var(--accent)',
              border: 'none',
              borderRadius: 8,
              padding: '8px 18px',
              fontWeight: 600,
              fontSize: 16,
              boxShadow: '0 2px 8px rgba(33,150,243,0.08)',
              cursor: 'pointer',
              transition: 'background 0.3s, color 0.3s',
            }}
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>

        {/* News & Threats Section */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 22, color: 'var(--accent)', marginBottom: 18, fontWeight: 700 }}>News & Threat Intelligence</h2>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <div style={{ flex: 2, minWidth: 320 }}><CyberNewsPanel /></div>
            <div style={{ flex: 1, minWidth: 320 }}><ThreatIntelPanel /></div>
          </div>
        </div>

        {/* Analytics Section */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 22, color: 'var(--accent)', marginBottom: 18, fontWeight: 700 }}>Analytics</h2>
          <StatsPanel logs={logs} alerts={alerts} />
          <SecurityAnalyticsPanel logs={logs} alerts={alerts} />
          <div style={{ display: 'flex', gap: 32, marginBottom: 32 }}>
            <div style={{ flex: 2, background: 'var(--card-bg)', borderRadius: 12, boxShadow: '0 2px 8px #2196f308', padding: 16 }}>
              <h3 style={{ marginBottom: 8 }}>Logs Over Time</h3>
              <LogsTimeChart logs={logs} />
            </div>
          </div>
        </div>

        {/* Alerts, Logs & Sidebar Section */}
        <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 20, color: 'var(--accent)', marginBottom: 14, fontWeight: 700 }}>Active Alerts</h2>
            {alerts.length === 0 ? <div style={{ color: '#888', fontSize: 15, marginTop: 12 }}>No alerts</div> : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {alerts.map(a => (
                  <li key={a.id} style={{ background: 'var(--card-bg)', borderRadius: 8, boxShadow: '0 2px 8px #f4433608', marginBottom: 12, padding: 16, borderLeft: '6px solid #f44336' }}>
                    <strong>{a.ip}</strong> — {a.reason}
                    <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>{new Date(a.timestamp).toLocaleString()}</div>
                    <IncidentResponseTools
                      alert={a}
                      onBlockIP={ip => alert(`Block IP: ${ip}`)}
                      onResolve={id => alert(`Mark alert ${id} as resolved`)}
                      onNotify={alertObj => alert(`Notify team about alert: ${alertObj.reason}`)}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div style={{ flex: 2 }}>
            <h2 style={{ fontSize: 20, color: 'var(--accent)', marginBottom: 14, fontWeight: 700 }}>Recent Logs</h2>
            <LogFilter onFilterChange={setFilters} />
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--card-bg)', borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px #2196f308' }}>
              <thead>
                <tr style={{ background: darkMode ? '#232526' : '#e3f2fd', fontWeight: 600 }}><th>Time</th><th>IP</th><th>Level</th><th>Message</th></tr>
              </thead>
              <tbody>
                {filteredLogs.map(l => (
                  <tr key={l.id} style={{ background: darkMode ? '#2c5364' : '#f6f8fa' }}>
                    <td>{new Date(l.timestamp).toLocaleTimeString()}</td>
                    <td>{l.ip}</td>
                    <td><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 12, fontSize: 13, fontWeight: 500, color: '#fff', background: l.level === 'error' ? '#f44336' : l.level === 'warning' ? '#ff9800' : '#2196f3' }}>{l.level}</span></td>
                    <td>{l.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <LogSimulator />
            <LogExport logs={logs} alerts={alerts} />
          </div>
          <div style={{ flex: '0 0 340px', minWidth: 260 }}>
            <EducationalWidget />
          </div>
        </div>
      </div>
    </div>
  );
}
