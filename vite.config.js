import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: 'prompt',
      injectRegister: false,

      // desactiva cache automática de workbox
      workbox: undefined,
      manifest: {
        name: 'PenaltyAdmin',
        short_name: 'Penalty Admin',
        description: 'Una app para gestion de penalty',

        start_url: '/',
        display: 'standalone',

        background_color: '#ffffff',
        theme_color: '#20a04f',

        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],

  server: {
    port: 5173,
    open: true
  }
})