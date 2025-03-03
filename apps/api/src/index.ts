import fastify from 'fastify';
import cors from '@fastify/cors';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { inferAsyncReturnType } from '@trpc/server';
import { TRPCError } from '@trpc/server';
import { createContext } from './server/context';
import { appRouter } from './server/root';

type ContextType = inferAsyncReturnType<typeof createContext>;

async function buildServer() {
  const server = fastify({
    maxParamLength: 5000,
    logger: true,
  });

  await server.register(cors, {
    origin: (origin: string | undefined, cb: (err: Error | null, allow: boolean) => void) => {
      const allowedDomains = [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        process.env.FRONTEND_URL,
      ].filter(Boolean);

      if (!origin || allowedDomains.includes(origin)) {
        cb(null, true);
        return;
      }
      
      cb(new Error('Not allowed'), false);
    },
    credentials: true,
  });

  await server.register(fastifyTRPCPlugin, {
    prefix: '/api/trpc',
    trpcOptions: {
      router: appRouter,
      createContext,
      onError({ error, path }: { 
        error: TRPCError; 
        path: string | undefined;
        type: 'query' | 'mutation' | 'subscription' | 'unknown';
        ctx: ContextType | undefined;
      }) {
        if (error instanceof TRPCError && error.code === 'INTERNAL_SERVER_ERROR') {
          console.error(`Error on ${path ?? '<no-path>'}:`, error);
        }
      },
    },
  });

  return server;
}

async function main() {
  const server = await buildServer();
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
  const host = process.env.HOST || '0.0.0.0';

  try {
    await server.listen({ port, host });
    console.log(`API server listening on ${host}:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});