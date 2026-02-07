
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'ChatBot',
        short_name: 'ChatBot | Powered by gemini AI',
        description: 'My AI Chatbot Application',
        theme_color: '#2563EB', // Matches your blue notification bar
        background_color: '#ffffff',
        display: 'standalone', // CRITICAL: This triggers the install icon
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png'
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        // 1. Ensure the file is included in the static assets cache
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],

        // 2. Set the fallback page for navigation requests
        navigateFallback: '/index.html',

         // THE FIX: Prevent the SW from intercepting Firebase Auth paths
        navigateFallbackDenylist: [/^\/__\/auth/],
        // Optional: ensure other API routes also bypass the SW

        runtimeCaching: [
           {
            urlPattern: /^\/__\/auth/,
            handler: 'NetworkOnly',
          },
          
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 365 days
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 365 days
              }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|png|jpeg|svg|gif)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          },
          {
            urlPattern: /api\/.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 1 // 1 hour cache for API data
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ],
   base: '/',


  // Add this server configuration
  server: {
    // This handles API routes in development
    proxy: {
      '/api': {
        target: 'http://localhost:5173',
        changeOrigin: true,
        // Rewrite path to serve from public folder
        rewrite: (path) => path.replace(/^\/api/, '/mock-api')
      }
    }
  },


  // Make sure the public folder is properly served
  publicDir: 'public'
})
