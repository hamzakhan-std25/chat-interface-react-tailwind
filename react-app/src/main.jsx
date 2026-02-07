import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/authContext.jsx'
// Add this to your entry file (main.jsx / index.js)
import { registerSW } from 'virtual:pwa-register';

registerSW({ immediate: true });

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <AuthProvider> 
      <App />
    </AuthProvider>
  // </StrictMode>
)


