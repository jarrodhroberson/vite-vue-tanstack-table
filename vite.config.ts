import path from 'path';
import fs from 'fs';
import {defineConfig, ViteDevServer} from 'vite';
import vue from '@vitejs/plugin-vue'

const sendEvent = (res: any, event: string, data: any) => {
  res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

function jsonMiddlewarePlugin() {
  return {
    name: 'json-middleware',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        console.log('Middleware: allocations');
        console.log(req.url);
        switch (req.url) {
          case '/allocations':
            console.log('returning allocations data');
            res.writeHead(200, {
              'Content-Type': 'text/event-stream',
              'Cache-Control': 'no-cache',
              'Connection': 'keep-alive'
            });

            const filePath = '/home/jhr/git/vite-tanstack-table/public/allocations'

            try {
              const files = fs.readdirSync(filePath);
              for (const file of files) {
                const content = fs.readFileSync(path.join(filePath, file), 'utf-8');
                console.log('sending ',content)
                sendEvent(res, 'allocation', JSON.parse(content));
              }
              sendEvent(res, 'complete', {});
            } catch (error) {
              console.error('Error reading files:', error);
              sendEvent(res, 'error', error.message);
            } finally {
              res.end();
            }
            break;
        }
        next();
      });
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
      vue(),
      jsonMiddlewarePlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
})
