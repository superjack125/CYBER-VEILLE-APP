const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

// Helper to get saved API key
export function getApiKey() {
  return localStorage.getItem('api_key')
}

export async function fetchLogs(limit = 100) {
  const res = await fetch(`${BASE}/api/logs?limit=${limit}`)
  if (!res.ok) return []
  return res.json()
}

export async function fetchAlerts(limit = 100) {
  const res = await fetch(`${BASE}/api/alerts?limit=${limit}`)
  if (!res.ok) return []
  return res.json()
}

export async function postLog(data) {
  const apiKey = getApiKey()
  if (!apiKey) throw new Error('API key required')
  
  const res = await fetch(`${BASE}/api/logs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey
    },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('Failed to post log')
  return res.json()
}
