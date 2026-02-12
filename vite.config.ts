import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { codeInspectorPlugin } from 'code-inspector-plugin'
import { defineConfig } from 'vite'

import { compilerOptions } from './tsconfig.json'

const host = process.env.TAURI_DEV_HOST

const resolveAliasFromTsConfig = (paths: Record<string, string[]>) =>
  Object.entries(paths).flatMap(([key, values]) => {
    const [firstPath] = values

    if (!firstPath) {
      return []
    }

    return [
      {
        find: key.replace(/\/\*$/, ''),
        replacement: fileURLToPath(
          new URL(firstPath.replace(/\/\*$/, ''), import.meta.url)
        ),
      },
    ]
  })

console.log(resolveAliasFromTsConfig(compilerOptions.paths))

// https://vite.dev/config/
export default defineConfig(async () => ({
  plugins: [
    react(),
    tailwindcss(),
    codeInspectorPlugin({
      bundler: 'vite',
    }),
  ],

  resolve: {
    alias: resolveAliasFromTsConfig(compilerOptions.paths),
  },

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent Vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: 'ws',
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell Vite to ignore watching `src-tauri`
      ignored: ['**/src-tauri/**'],
    },
  },
}))
