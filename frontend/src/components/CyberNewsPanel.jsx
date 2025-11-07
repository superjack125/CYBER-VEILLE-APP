import React, { useEffect, useState } from 'react';

const SOURCES = [
  { name: 'Krebs on Security', url: 'https://krebsonsecurity.com/feed/' },
  { name: 'The Hacker News', url: 'https://feeds.feedburner.com/TheHackersNews' },
  { name: 'Dark Reading', url: 'https://www.darkreading.com/rss.xml' },
  { name: 'Bleeping Computer', url: 'https://www.bleepingcomputer.com/feed/' },
  { name: 'SecurityWeek', url: 'https://feeds.securityweek.com/securityweek' }
];

export function CyberNewsPanel() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      try {
        const all = await Promise.all(SOURCES.map(async src => {
          const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(src.url)}`);
          const data = await res.json();
          return { name: src.name, items: (data.items || []).slice(0, 3) };
        }));
        setNews(all);
      } catch (err) {
        setNews([]);
      }
      setLoading(false);
    }
    fetchNews();
  }, []);

  return (
    <div style={{
      background: '#111',
      borderRadius: 14,
      boxShadow: '0 4px 24px #0008',
      padding: 18,
      marginBottom: 22,
      maxWidth: 900,
      marginLeft: 'auto',
      marginRight: 'auto',
      transition: 'max-height 0.4s cubic-bezier(.4,0,.2,1)',
      border: '1px solid #222',
      color: '#fafafa',
      backdropFilter: 'blur(2px)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <h2 style={{ fontSize: 22, margin: 0, color: '#90caf9', letterSpacing: 1 }}>📰 Cybersecurity News</h2>
        <button
          onClick={() => setOpen(o => !o)}
          className={`news-toggle-btn${open ? '' : ' closed'}`}
          style={{
            background: 'none',
            border: 'none',
            color: open ? '#90caf9' : '#f44336',
            fontWeight: 700,
            fontSize: 16,
            cursor: 'pointer',
            padding: 6,
            outline: 'none',
            transition: 'color 0.3s',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
          aria-label={open ? 'Hide news' : 'Show news'}
        >
          <span
            style={{
              display: 'inline-block',
              transition: 'transform 0.4s cubic-bezier(.4,0,.2,1), opacity 0.4s',
              transform: open ? 'rotate(0deg)' : 'rotate(-90deg)',
              opacity: open ? 1 : 0.7
            }}
          >📰</span>
          {open ? 'Hide' : 'Show'}
        </button>
      </div>
      <div style={{ maxHeight: open ? 400 : 0, overflow: 'hidden', transition: 'max-height 0.4s cubic-bezier(.4,0,.2,1)' }}>
        {loading ? <div style={{ padding: 12, color: '#fafafa' }}>Loading news...</div> : (
          <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 8 }}>
            {news.map(src => (
              <div key={src.name} style={{
                minWidth: 200,
                flex: '0 0 200px',
                background: 'linear-gradient(135deg, #232526 0%, #0f2027 100%)',
                borderRadius: 10,
                padding: 14,
                boxShadow: '0 2px 8px #0006',
                transition: 'box-shadow 0.2s',
                marginBottom: 4,
                color: '#fafafa',
                border: '1px solid #222'
              }}>
                <h3 style={{ fontSize: 15, margin: '0 0 8px 0', color: '#90caf9', fontWeight: 600 }}>{src.name}</h3>
                <ul style={{ paddingLeft: 14, margin: 0 }}>
                  {src.items.map(item => (
                    <li key={item.link} style={{ marginBottom: 7, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: '#fafafa',
                          textDecoration: 'none',
                          transition: 'color 0.2s',
                          fontWeight: 500,
                          background: 'linear-gradient(90deg, #90caf9 0%, #232526 100%)',
                          borderRadius: 4,
                          padding: '2px 6px'
                        }}
                        onMouseOver={e => e.target.style.color = '#f44336'}
                        onMouseOut={e => e.target.style.color = '#fafafa'}
                      >{item.title}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
