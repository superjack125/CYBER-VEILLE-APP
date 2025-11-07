import React from 'react'

function downloadBlob(data, filename, type = 'text/csv') {
  const blob = new Blob([data], { type })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

export function LogExport({ logs, alerts }) {
  function exportCSV() {
    // Convert logs to CSV
    const headers = ['Timestamp', 'IP', 'Level', 'Message']
    const rows = logs.map(l => [
      new Date(l.timestamp).toISOString(),
      l.ip,
      l.level,
      // Escape quotes in message
      `"${(l.message || '').replace(/"/g, '""')}"`
    ])
    const csv = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n')
    
    downloadBlob(csv, `cyber-logs-${new Date().toISOString()}.csv`)
  }

  function exportJSON() {
    const data = {
      exported_at: new Date().toISOString(),
      logs,
      alerts
    }
    const json = JSON.stringify(data, null, 2)
    downloadBlob(
      json,
      `cyber-export-${new Date().toISOString()}.json`,
      'application/json'
    )
  }

  return (
    <div style={{ marginBottom: 20 }}>
      <button
        onClick={exportCSV}
        style={{
          padding: '8px 16px',
          marginRight: 10,
          backgroundColor: '#4caf50',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer'
        }}
      >
        Export Logs (CSV)
      </button>
      <button
        onClick={exportJSON}
        style={{
          padding: '8px 16px',
          backgroundColor: '#2196f3',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer'
        }}
      >
        Export All (JSON)
      </button>
    </div>
  )
}