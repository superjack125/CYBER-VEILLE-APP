import React from 'react'

const COLORS = ['#2196f3', '#f44336', '#4caf50', '#ff9800']

export function SimpleBarChart({ data, label = '', height = 200 }) {
  if (!data?.length) return null
  const max = Math.max(...data.map(d => d.value))
  
  return (
    <div style={{ marginBottom: 20 }}>
      <h3 style={{ marginBottom: 10 }}>{label}</h3>
      <div style={{ 
        display: 'flex',
        alignItems: 'flex-end',
        height,
        gap: 4,
        padding: '0 10px'
      }}>
        {data.map((d, i) => (
          <div
            key={d.label}
            title={`${d.label}: ${d.value}`}
            style={{
              flex: 1,
              backgroundColor: COLORS[i % COLORS.length],
              height: `${(d.value / max) * 100}%`,
              minWidth: 20,
              borderRadius: '3px 3px 0 0',
              transition: 'height 0.3s ease'
            }}
          />
        ))}
      </div>
      <div style={{
        display: 'flex',
        gap: 4,
        padding: '10px'
      }}>
        {data.map((d, i) => (
          <div key={d.label} style={{ flex: 1, fontSize: 12, textAlign: 'center' }}>
            {d.label}
          </div>
        ))}
      </div>
    </div>
  )
}