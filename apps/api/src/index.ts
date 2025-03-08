import Fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import {
  PodAggregator,
  ProviderType,
  type Address,
  type Order,
  type Product,
  type ShippingMethod
} from './pod/pod-api-aggregator';

// API response types
interface ErrorResponse {
  error: string;
  message: string;
  details?: unknown;
}

interface SuccessResponse<T> {
  data: T;
}

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

// API Key management
interface ApiKey {
  key: string;
  name: string;
  createdAt: Date;
  lastUsed?: Date;
}

// In-memory API key store (replace with database in production)
const apiKeys = new Map<string, ApiKey>();

// Configuration
const CONFIG = {
  PORT: Number(process.env.PORT) || 3001,
  HOST: process.env.HOST || '0.0.0.0',
  NODE_ENV: process.env.NODE_ENV || 'development',
  ADMIN_KEY: process.env.ADMIN_KEY || 'admin-secret',
  PROVIDERS: {
    [ProviderType.PRINTIFY]: process.env.PRINTIFY_API_KEY || 'demo',
    [ProviderType.PRINTFUL]: process.env.PRINTFUL_API_KEY,
    [ProviderType.GELATO]: process.env.GELATO_API_KEY,
    [ProviderType.GOOTEN]: process.env.GOOTEN_API_KEY,
  }
} as const;

// Create fastify instance
const app = Fastify({
  logger: {
    level: CONFIG.NODE_ENV === 'development' ? 'debug' : 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname'
      }
    }
  }
});

// Initialize POD Aggregator with all configured providers
const podAggregator = PodAggregator.createWithProviders(CONFIG.PROVIDERS);

// Auth middleware
app.addHook('onRequest', async (request, reply) => {
  // Skip auth for API key registration and docs
  if (request.url === '/api/auth/register' || request.url.startsWith('/documentation')) {
    return;
  }

  const authHeader = request.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return reply.status(401).send({
      error: 'Unauthorized',
      message: 'Missing or invalid API key'
    });
  }

  const apiKey = authHeader.substring(7); // Remove 'Bearer ' prefix
  const keyData = apiKeys.get(apiKey);

  if (!keyData) {
    return reply.status(401).send({
      error: 'Unauthorized',
      message: 'Invalid API key'
    });
  }

  // Update last used timestamp
  keyData.lastUsed = new Date();
  apiKeys.set(apiKey, keyData);
});

const setupPlugins = async () => {
  // Register CORS
  await app.register(cors, {
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  });

  // Register Swagger documentation
  await app.register(swagger, {
    openapi: {
      info: {
        title: 'PrintVisionBolt API',
        description: 'API for Print-on-Demand service aggregation',
        version: '1.0.0'
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer'
          }
        }
      },
      security: [{ bearerAuth: [] }],
      tags: [
        { name: 'auth', description: 'Authentication endpoints' },
        { name: 'products', description: 'Product management endpoints' },
        { name: 'orders', description: 'Order management endpoints' },
        { name: 'shipping', description: 'Shipping rate endpoints' }
      ]
    }
  });
};

const setupRoutes = async () => {
// API Key registration endpoint
app.post<{
  Body: { name: string };
  Headers: { authorization: string };
  Reply: ApiResponse<{ apiKey: string }>;
}>('/api/auth/register', {
  schema: {
    tags: ['auth'],
    body: {
      type: 'object',
      required: ['name'],
      properties: {
        name: { type: 'string' }
      }
    },
    headers: {
      type: 'object',
      required: ['authorization'],
      properties: {
        authorization: { type: 'string' }
      }
    },
    response: {
      200: {
        type: 'object',
        properties: {
          data: {
            type: 'object',
            properties: {
              apiKey: { type: 'string' }
            }
          }
        }
      },
      401: {
        type: 'object',
        properties: {
          error: { type: 'string' },
          message: { type: 'string' }
        }
      }
    }
  }
}, async (request, reply) => {
  const authHeader = request.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return reply.status(401).send({
      error: 'Unauthorized',
      message: 'Missing or invalid admin key'
    });
  }

  const adminKey = authHeader.substring(7);
  if (adminKey !== CONFIG.ADMIN_KEY) {
    return reply.status(401).send({
      error: 'Unauthorized',
      message: 'Invalid admin key'
    });
  }

  const apiKey = Buffer.from(`${Date.now()}-${request.body.name}`).toString('base64');
  apiKeys.set(apiKey, {
    key: apiKey,
    name: request.body.name,
    createdAt: new Date()
  });

  return {
    data: { apiKey }
  };
});

  // Products endpoints
  app.get<{
    Reply: ApiResponse<Record<ProviderType, Product[]>>
  }>('/api/products', {
    schema: {
      tags: ['products'],
      response: {
        200: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              additionalProperties: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    title: { type: 'string' },
                    description: { type: 'string', nullable: true },
                    price: { type: 'number', nullable: true },
                    images: { type: 'array', items: { type: 'string' } }
                  }
                }
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const products = await podAggregator.getAllProducts();
      return { data: products };
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: 'Failed to fetch products'
      });
    }
  });

  // Orders endpoint
  app.post<{
    Body: Partial<Order> & { provider: ProviderType };
    Reply: ApiResponse<Order>
  }>('/api/orders', {
    schema: {
      tags: ['orders'],
      body: {
        type: 'object',
        required: ['provider'],
        properties: {
          provider: { 
            type: 'string',
            enum: Object.values(ProviderType)
          }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                id: { type: 'string' }
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    const { provider, ...orderData } = request.body;

    try {
      const order = await podAggregator.createOrder(provider, orderData);
      return { data: order };
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Failed to create order'
      });
    }
  });

  // Shipping rates endpoint
  app.post<{
    Body: Address;
    Reply: ApiResponse<Record<ProviderType, ShippingMethod[]>>;
  }>('/api/shipping/rates', {
    schema: {
      tags: ['shipping'],
      body: {
        type: 'object',
        required: ['name', 'address1', 'city', 'country', 'zip'],
        properties: {
          name: { type: 'string' },
          address1: { type: 'string' },
          city: { type: 'string' },
          state: { type: 'string' },
          country: { type: 'string' },
          zip: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              additionalProperties: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    rate: { type: 'number' },
                    currency: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const rates = await podAggregator.compareShippingRates(request.body);
      return { data: rates };
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: 'Failed to fetch shipping rates'
      });
    }
  });
};

// Error handler
app.setErrorHandler((error, request, reply) => {
  request.log.error(error);
  
  const errorResponse: ErrorResponse = {
    error: 'Internal Server Error',
    message: error instanceof Error ? error.message : 'An unknown error occurred'
  };

  if ('validation' in error) {
    errorResponse.error = 'Validation Error';
    errorResponse.details = error.validation;
    return reply.status(400).send(errorResponse);
  }

  return reply.status(500).send(errorResponse);
});

// Start the server
const start = async () => {
  try {
    // Setup application
    await setupPlugins();
    await setupRoutes();

    // Start server
    await app.listen({ port: CONFIG.PORT, host: CONFIG.HOST });
    app.log.info(`Server running at http://${CONFIG.HOST}:${CONFIG.PORT}`);
    app.log.info('Documentation available at /documentation');
  } catch (err) {
    app.log.error('Failed to start server:', err);
    process.exit(1);
  }
};

// Handle unhandled rejections and exceptions
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  process.exit(1);
});

start();