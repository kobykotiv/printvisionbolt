import express from 'express';
import cors from 'cors';
import * as trpcExpress from '@trpc/server/adapters/express';
import { createContext } from './server/context';
import { appRouter } from './server/trpc';

const app = express();

// CORS middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

// Health check endpoint
app.get('/health', (_, res) => {
  res.json({ status: 'ok' });
});

// tRPC middleware
app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`🚀 Server ready at http://localhost:${port}`);
  console.log(`⚡ tRPC ready at http://localhost:${port}/trpc`);
});