import React from 'react';

export function IncidentResponseTools({ alert, onBlockIP, onResolve, onNotify }) {
  return (
    <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
      <button
        style={{ background: '#f44336', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontWeight: 600 }}
        onClick={() => onBlockIP(alert.ip)}
        title="Block IP"
      >Block IP</button>
      <button
        style={{ background: '#4caf50', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontWeight: 600 }}
        onClick={() => onResolve(alert.id)}
        title="Mark as Resolved"
      >Resolve</button>
      <button
        style={{ background: '#2196f3', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontWeight: 600 }}
        onClick={() => onNotify(alert)}
        title="Notify Team"
      >Notify</button>
    </div>
  );
}
