import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Allow external connections
    port: 5173,
    allowedHosts: [
      'localhost',
      '.trycloudflare.com', // Allow all Cloudflare tunnel subdomains
      '.ngrok.io', // Also allow ngrok if you use it
      '.localtunnel.me' // Also allow localtunnel if you use it
    ]
  },
  preview: {
    host: true, // Also allow external connections in preview mode
    port: 4173,
    allowedHosts: [
      'localhost',
      '.trycloudflare.com',
      '.ngrok.io',
      '.localtunnel.me'
    ]
  }
})
