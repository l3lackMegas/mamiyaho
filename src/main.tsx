import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AnimatePresence } from 'motion/react'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AnimatePresence key='main-app-area' mode='wait'>
      <App />
    </AnimatePresence>
  </StrictMode>,
)
