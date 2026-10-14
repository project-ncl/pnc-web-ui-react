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
 * Optional locally-trusted TLS cert for DEV_HOST (git-ignored):
 *   mkcert -install
 *   mkcert -key-file certs/$VITE_DEV_HOST-key.pem -cert-file certs/$VITE_DEV_HOST-cert.pem $VITE_DEV_HOST
 */
const certPath = `certs/${DEV_HOST}-cert.pem`;
const keyPath = `certs/${DEV_HOST}-key.pem`;
const https =
  DEV_HOST && fs.existsSync(certPath) ? { key: fs.readFileSync(keyPath), cert: fs.readFileSync(certPath) } : undefined;

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
