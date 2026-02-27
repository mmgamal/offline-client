import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import fs from 'fs';
import path from 'path';
import child_process from 'child_process';
import { env } from 'process';

// const baseFolder =
//   env.APPDATA !== undefined && env.APPDATA !== ''
//     ? `${env.APPDATA}/ASP.NET/https`
//     : `${env.HOME}/.aspnet/https`;

// const certificateName = "offline-client";
// const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
// const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

// if (!fs.existsSync(baseFolder)) {
//   fs.mkdirSync(baseFolder, { recursive: true });
// }

// if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
//   if (0 !== child_process.spawnSync('dotnet', [
//     'dev-certs',
//     'https',
//     '--export-path',
//     certFilePath,
//     '--format',
//     'Pem',
//     '--no-password',
//   ], { stdio: 'inherit', }).status) {
//     throw new Error("Could not create certificate.");
//   }
// }


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd(), '');
  console.log("Client URL :", env.VITE_APP_CURRENT_URI);
  console.log("Api URL :", env.VITE_APP_API_URI);
  console.log("Hub URL :", env.VITE_APP_HUB_URI);
  console.log("API Timeout :", env.VITE_APP_API_TIMEOUT);
  console.log("Client Port :", env.VITE_PORT);
  return {
    plugins: [
      react(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_APP_API_URI,
          changeOrigin: true,
          secure: false,
        },
      },
      //port: parseInt(env.VITE_PORT),
      // https: {
      //   key: fs.readFileSync(keyFilePath),
      //   cert: fs.readFileSync(certFilePath),
      // }
    }
  }
})