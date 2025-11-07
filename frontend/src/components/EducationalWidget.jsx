import React from 'react';

const TIPS = [
  'Use strong, unique passwords for every account.',
  'Enable multi-factor authentication wherever possible.',
  'Keep your software and systems up to date.',
  'Be cautious with email attachments and links.',
  'Regularly back up important data.',
  'Monitor your network for unusual activity.',
  'Educate your team about phishing and social engineering.'
];

export function EducationalWidget() {
  return (
    <div style={{
      background: '#232526',
      color: '#fafafa',
      borderRadius: 10,
      boxShadow: '0 2px 8px #0006',
      padding: 16,
      marginBottom: 24,
      maxWidth: 340,
      marginLeft: 'auto',
      marginRight: 0,
      border: '1px solid #333',
      fontSize: 15
    }}>
      <h3 style={{ color: '#90caf9', fontSize: 17, marginBottom: 10 }}>Security Tips</h3>
      <ul style={{ paddingLeft: 18, margin: 0 }}>
        {TIPS.map((tip, i) => (
          <li key={i} style={{ marginBottom: 8 }}>{tip}</li>
        ))}
      </ul>
    </div>
  );
}
