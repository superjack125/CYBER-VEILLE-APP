import React, { useEffect, useState } from 'react';

// Example threat feeds (can be replaced with real APIs)
const THREAT_FEEDS = [
  {
    name: 'Malicious IPs',
    url: 'https://threatintelligence.example.com/malicious-ips', // Placeholder
    items: [
      { ip: '185.6.233.1', threat: 'Botnet', lastSeen: '2025-11-07' },
      { ip: '45.77.23.88', threat: 'Phishing', lastSeen: '2025-11-07' },
      { ip: '103.21.244.0', threat: 'DDoS', lastSeen: '2025-11-06' }
    ]
  },
  {
    name: 'Trending CVEs',
    url: 'https://cve.mitre.org/data/downloads/allitems.html', // Placeholder
    items: [
      { cve: 'CVE-2025-12345', desc: 'Remote code execution in XYZ', severity: 'Critical' },
      { cve: 'CVE-2025-23456', desc: 'Privilege escalation in ABC', severity: 'High' },
      { cve: 'CVE-2025-34567', desc: 'SQL injection in DEF', severity: 'Medium' }
    ]
  }
];

export function ThreatIntelPanel() {
  // In a real app, fetch threat feeds from APIs
  const [feeds, setFeeds] = useState(THREAT_FEEDS);

  return (
    <div style={{
      background: '#222',
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
      <h2 style={{ color: '#f44336', fontSize: 20, marginBottom: 12 }}>Threat Intelligence</h2>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        {feeds.map(feed => (
          <div key={feed.name} style={{ flex: '1 1 300px', background: '#111', borderRadius: 8, padding: 12, boxShadow: '0 1px 6px #0006', marginBottom: 8 }}>
            <h3 style={{ color: '#90caf9', fontSize: 16, marginBottom: 8 }}>{feed.name}</h3>
            <ul style={{ paddingLeft: 16, margin: 0 }}>
              {feed.name === 'Malicious IPs' && feed.items.map(item => (
                <li key={item.ip} style={{ marginBottom: 6, fontSize: 14 }}>
                  <span style={{ color: '#f44336', fontWeight: 600 }}>{item.ip}</span> — {item.threat} <span style={{ color: '#888', fontSize: 12 }}>({item.lastSeen})</span>
                </li>
              ))}
              {feed.name === 'Trending CVEs' && feed.items.map(item => (
                <li key={item.cve} style={{ marginBottom: 6, fontSize: 14 }}>
                  <span style={{ color: '#ff9800', fontWeight: 600 }}>{item.cve}</span> — {item.desc} <span style={{ color: item.severity === 'Critical' ? '#f44336' : item.severity === 'High' ? '#ff9800' : '#90caf9', fontWeight: 500 }}>({item.severity})</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
