import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

/**
 * Local dev hostname, mapped to 127.0.0.1 in /etc/hosts
 *
 * Required to make devel REST API and localhost UI same origin.
 */
const DEV_HOST = process.env.VITE_DEV_HOST;

/**
 * Optional locally-trusted TLS cert (git-ignored):
 *   mkcert -install
 *   mkcert -key-file certs/dev-key.pem -cert-file certs/dev-cert.pem <DEV_HOST>
 */
const https = fs.existsSync('certs/dev-cert.pem')
  ? { key: fs.readFileSync('certs/dev-key.pem'), cert: fs.readFileSync('certs/dev-cert.pem') }
  : undefined;

// https://vitejs.dev/config/
export default () => {
  return defineConfig({
    plugins: [react(), tsconfigPaths()],
    server: {
      port: 3000,
      https,
      ...(DEV_HOST && { host: DEV_HOST, allowedHosts: [DEV_HOST] }),
    },
  });
};
