import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';

export function StatsPanel({ logs, alerts }) {
  // Calculate stats
  const totalLogs = logs.length;
  const totalAlerts = alerts.length;
  const uniqueIPs = new Set(logs.map(l => l.ip)).size;
  const topIP = logs.length ? logs.reduce((acc, l) => {
    acc[l.ip] = (acc[l.ip] || 0) + 1;
    return acc;
  }, {}) : {};
  const topSource = Object.entries(topIP).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ bgcolor: '#e3f2fd' }}>
          <CardContent>
            <Typography variant="h6">Total Logs</Typography>
            <Typography variant="h4">{totalLogs}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ bgcolor: '#ffebee' }}>
          <CardContent>
            <Typography variant="h6">Total Alerts</Typography>
            <Typography variant="h4">{totalAlerts}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ bgcolor: '#e8f5e9' }}>
          <CardContent>
            <Typography variant="h6">Unique IPs</Typography>
            <Typography variant="h4">{uniqueIPs}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ bgcolor: '#fff3e0' }}>
          <CardContent>
            <Typography variant="h6">Top Source IP</Typography>
            <Typography variant="h5">{topSource}</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
