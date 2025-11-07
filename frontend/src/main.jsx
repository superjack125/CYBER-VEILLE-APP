import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

import './styles.css'

// Ensure a root element exists (helps when the file is opened standalone)
if (!document.getElementById('root')) {
  const el = document.createElement('div')
  el.id = 'root'
  document.body.appendChild(el)
}

const root = createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Vite HMR accept
if (import.meta.hot) {
  import.meta.hot.accept()
}
