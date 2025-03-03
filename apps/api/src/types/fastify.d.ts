declare module 'fastify' {
  import { FastifyInstance as BaseFastifyInstance } from 'fastify';
  export interface FastifyInstance extends BaseFastifyInstance {}
  export default function fastify(opts?: any): FastifyInstance;
}

declare module '@fastify/cors' {
  import { FastifyPluginCallback } from 'fastify';
  interface FastifyCorsOptions {
    origin?: boolean | string | RegExp | (string | RegExp)[] | ((origin: string, cb: (err: Error | null, allow: boolean) => void) => void);
    methods?: string | string[];
    allowedHeaders?: string | string[];
    exposedHeaders?: string | string[];
    credentials?: boolean;
    maxAge?: number;
    preflightContinue?: boolean;
    optionsSuccessStatus?: number;
    preflight?: boolean;
  }

  const cors: FastifyPluginCallback<FastifyCorsOptions>;
  export default cors;
}