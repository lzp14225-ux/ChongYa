import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const configuredPort = env.VITE_DEV_SERVER_PORT;

  if (!configuredPort) {
    throw new Error('缺少必填环境变量：VITE_DEV_SERVER_PORT，请在 frontend/.env 中配置');
  }

  const port = Number(configuredPort);

  if (!Number.isInteger(port)) {
    throw new Error('环境变量 VITE_DEV_SERVER_PORT 必须是整数');
  }

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port,
      strictPort: true
    },
    preview: {
      host: '0.0.0.0',
      port,
      strictPort: true
    }
  };
});
