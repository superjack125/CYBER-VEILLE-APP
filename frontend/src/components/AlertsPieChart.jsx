import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#2196f3', '#f44336', '#ff9800', '#4caf50', '#9c27b0'];

export function AlertsPieChart({ alerts }) {
  // Group alerts by reason
  const byReason = {};
  alerts.forEach(a => {
    byReason[a.reason] = (byReason[a.reason] || 0) + 1;
  });
  const data = Object.entries(byReason).map(([reason, value], i) => ({ name: reason, value }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          label
        >
          {data.map((entry, i) => (
            <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
