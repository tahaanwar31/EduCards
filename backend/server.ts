import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import apiRoutes from './routes.js';
import { connectDB } from './db.js';
import 'dotenv/config';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Connect to MongoDB
  await connectDB();

  // API routes
  app.get('/api/test', (req, res) => res.json({ ok: true }));
  app.use('/api/v1', apiRoutes);

  if (process.env.NODE_ENV !== 'production') {
    const root = path.resolve(process.cwd(), 'frontend');
    const vite = await createViteServer({
      configFile: false,
      root,
      plugins: [react(), tailwindcss()],
      resolve: {
        alias: { '@': path.resolve(root, 'src') },
      },
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
