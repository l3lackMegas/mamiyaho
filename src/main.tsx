import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AnimatePresence } from 'motion/react'
import ReCAPTCHA from "react-google-recaptcha";

console.log("asdasd", import.meta.env.VITE_CAPTCHA_KEY ?? '')
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div style={{display: 'none'}}><ReCAPTCHA sitekey={import.meta.env.VITE_CAPTCHA_KEY ?? ''}/>,</div>
    <AnimatePresence key='main-app-area' mode='wait'>
      <App />
    </AnimatePresence>
  </StrictMode>,
)
