import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export function LogsTimeChart({ logs }) {
  // Group logs by minute
  const data = [];
  const byMinute = {};
  logs.forEach(l => {
    const d = new Date(l.timestamp);
    const key = `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
    byMinute[key] = (byMinute[key] || 0) + 1;
  });
  Object.entries(byMinute).forEach(([minute, count]) => {
    data.push({ minute, count });
  });
  data.sort((a, b) => a.minute.localeCompare(b.minute));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="minute" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Line type="monotone" dataKey="count" stroke="#2196f3" strokeWidth={3} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
