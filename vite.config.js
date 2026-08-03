import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: {
    jsxInject: `import React from 'react'`
  },
  server: {
    // PORT lets a tool (e.g. the Claude Code preview) assign a free port when
    // 5173 is already taken by another dev server in this folder.
    port: Number(process.env.PORT) || 5173,
    open: !process.env.PORT,
    // Vite alone does not run the Pages Functions in ./functions, so /api/*
    // used to return the SPA shell instead of JSON. The catalog hid that by
    // falling back to bundled data, but the admin panel just showed an empty
    // list. Forward the API to `npm run dev:cloudflare` (port 8788) so the
    // HMR server talks to the real D1 database.
    proxy: {
      '/api': {
        target: 'http://localhost:8788',
        changeOrigin: false
      }
    }
  }
});
