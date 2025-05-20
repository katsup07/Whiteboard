import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isDockerEnvironment= process.env.DOCKER_ENVIRONMENT === 'true'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Only used for docker container in development
    port: 5173,  
    strictPort: true, // Fail if the port is already in use
    watch: {
      usePolling: isDockerEnvironment, 
      interval: 1000  // Enable for file change detection in Docker container
    },
      hmr: {
      clientPort: 5173  // Ensure HMR works with Docker port forwarding
    },
    proxy: {
      '/drawings': {
        target: isDockerEnvironment ? 'http://server:3000' : 'http://localhost:3000', 
        changeOrigin: true,
      }
    }
  }
})
