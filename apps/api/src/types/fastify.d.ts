import { FastifyInstance as CoreFastifyInstance, FastifyLoggerInstance, FastifyBaseLogger } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';
import { RouteGenericInterface } from 'fastify/types/route';

export interface ServerInstance extends CoreFastifyInstance {
  // HTTP server
  server: Server;
  
  // Logging
  log: FastifyBaseLogger;
  
  // Configuration
  config: {
    PORT: number;
    HOST: string;
    NODE_ENV: string;
  };
}

// Request/Response types
export interface FastifyRequest<T extends RouteGenericInterface = RouteGenericInterface> {
  query: T extends { Querystring: any } ? T['Querystring'] : unknown;
  body: T extends { Body: any } ? T['Body'] : unknown;
  params: T extends { Params: any } ? T['Params'] : unknown;
  headers: T extends { Headers: any } ? T['Headers'] : unknown;
  log: FastifyLoggerInstance;
}

export interface FastifyReply {
  code(statusCode: number): FastifyReply;
  send(payload?: unknown): FastifyReply;
  status(statusCode: number): FastifyReply;
  header(name: string, value: string): FastifyReply;
  type(contentType: string): FastifyReply;
}

// Plugin options types
export interface PluginOptions {
  prefix?: string;
}