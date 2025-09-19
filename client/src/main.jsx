import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './i18n/index.js';

// Completely disable console logs for Supabase in development
if (import.meta.env.DEV) {
  const originalLog = console.log;
  const originalInfo = console.info;
  
  console.log = (...args) => {
    // Block all Supabase-related logs
    const message = args.join(' ');
    if (message.includes('Fetch finished loading') || 
        message.includes('supabase') || 
        message.includes('@supabase')) {
      return;
    }
    originalLog.apply(console, args);
  };
  
  console.info = (...args) => {
    const message = args.join(' ');
    if (message.includes('Fetch finished loading') || 
        message.includes('supabase') || 
        message.includes('@supabase')) {
      return;
    }
    originalInfo.apply(console, args);
  };
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
