import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initAnalytics } from './services/analytics.ts'

// Initialize Google Analytics from site.json config if configured
initAnalytics()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Clear 5-second initial loader safety timeout once React has mounted
if (typeof window !== 'undefined' && (window as any).__clearAppLoaderTimeout) {
  (window as any).__clearAppLoaderTimeout();
}

