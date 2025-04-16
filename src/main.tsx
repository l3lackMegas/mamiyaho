import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AnimatePresence } from 'motion/react'
import { GoogleReCaptchaProvider } from '@google-recaptcha/react';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div style={{display: 'none'}}>
      <GoogleReCaptchaProvider
        type="v3"
        siteKey={import.meta.env.VITE_CAPTCHA_KEY ?? ''}
      >
        <App />
      </GoogleReCaptchaProvider>
    </div>
    <AnimatePresence key='main-app-area' mode='wait'>
      <App />
    </AnimatePresence>
  </StrictMode>,
)
