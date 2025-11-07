import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#f44336', '#2196f3', '#ff9800', '#4caf50', '#9c27b0'];

export function SecurityAnalyticsPanel({ logs, alerts }) {
  // Top attackers (by IP)
  const topAttackers = useMemo(() => {
    const ipCounts = logs.reduce((acc, l) => {
      acc[l.ip] = (acc[l.ip] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(ipCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([ip, count]) => ({ ip, count }));
  }, [logs]);

  // Attack types (by alert reason)
  const attackTypes = useMemo(() => {
    const reasonCounts = alerts.reduce((acc, a) => {
      acc[a.reason] = (acc[a.reason] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(reasonCounts).map(([type, value], i) => ({ type, value }));
  }, [alerts]);

  // Anomaly detection (spikes in logs per hour)
  const anomalyData = useMemo(() => {
    const buckets = {};
    logs.forEach(l => {
      const hour = new Date(l.timestamp).getHours();
      buckets[hour] = (buckets[hour] || 0) + 1;
    });
    return Object.entries(buckets).map(([hour, count]) => ({ hour, count }));
  }, [logs]);

  return (
    <div style={{
      background: '#232526',
      color: '#fafafa',
      borderRadius: 12,
      boxShadow: '0 2px 12px #0008',
      padding: 18,
      marginBottom: 24,
      maxWidth: 900,
      marginLeft: 'auto',
      marginRight: 'auto',
      border: '1px solid #333',
      backdropFilter: 'blur(2px)'
    }}>
      <h2 style={{ color: '#90caf9', fontSize: 20, marginBottom: 12 }}>Security Analytics</h2>
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 260 }}>
          <h4 style={{ color: '#f44336', marginBottom: 8 }}>Top Attackers (IP)</h4>
          <BarChart width={260} height={180} data={topAttackers} style={{ background: 'transparent' }}>
            <XAxis dataKey="ip" stroke="#fafafa" fontSize={12} />
            <YAxis stroke="#fafafa" fontSize={12} allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#f44336" />
          </BarChart>
        </div>
        <div style={{ flex: 1, minWidth: 260 }}>
          <h4 style={{ color: '#2196f3', marginBottom: 8 }}>Attack Types</h4>
          <PieChart width={220} height={180}>
            <Pie data={attackTypes} dataKey="value" nameKey="type" cx="50%" cy="50%" outerRadius={70} label>
              {attackTypes.map((entry, i) => (
                <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
        <div style={{ flex: 1, minWidth: 260 }}>
          <h4 style={{ color: '#ff9800', marginBottom: 8 }}>Log Volume (Anomaly Detection)</h4>
          <BarChart width={260} height={180} data={anomalyData} style={{ background: 'transparent' }}>
            <XAxis dataKey="hour" stroke="#fafafa" fontSize={12} />
            <YAxis stroke="#fafafa" fontSize={12} allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#ff9800" />
          </BarChart>
        </div>
      </div>
    </div>
  );
}
