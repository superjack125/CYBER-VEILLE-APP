import React, { useState } from 'react'

export function LogFilter({ onFilterChange }) {
  const [filters, setFilters] = useState({
    search: '',
    level: 'all',
    timeRange: '1h'
  })

  function handleChange(e) {
    const { name, value } = e.target
    const newFilters = { ...filters, [name]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <div style={{ marginBottom: 20, display: 'flex', gap: 10 }}>
      <input
        type="text"
        name="search"
        value={filters.search}
        onChange={handleChange}
        placeholder="Search IP or message..."
        style={{ flex: 2, padding: 8 }}
      />
      <select
        name="level"
        value={filters.level}
        onChange={handleChange}
        style={{ flex: 1, padding: 8 }}
      >
        <option value="all">All Levels</option>
        <option value="info">Info</option>
        <option value="warning">Warning</option>
        <option value="error">Error</option>
      </select>
      <select
        name="timeRange"
        value={filters.timeRange}
        onChange={handleChange}
        style={{ flex: 1, padding: 8 }}
      >
        <option value="1h">Last Hour</option>
        <option value="24h">Last 24h</option>
        <option value="7d">Last 7 Days</option>
        <option value="all">All Time</option>
      </select>
    </div>
  )
}