# Shop Providers API Documentation

## Overview

The Shop Providers system manages connections between different print-on-demand services and store instances. Each store is allocated one instance of each provider type to maintain data isolation.

## Provider Types

```typescript
enum ProviderType {
  PRINTIFUL = 'printful',
  PRINTIFY = 'printify',
  GOOTEN = 'gooten',
  GELATO = 'gelato'
}
```

## Authentication

All API endpoints require a valid JWT token in the Authorization header:
```http
Authorization: Bearer <jwt_token>
```

## Endpoints

### Create Shop Provider

```http
POST /api/v1/shops/{shopId}/providers
```

Request body:
```json
{
  "providerType": "printful",
  "credentials": {
    "apiKey": "your_api_key",
    "webhookSecret": "your_webhook_secret"
  }
}
```

### List Shop Providers

```http
GET /api/v1/shops/{shopId}/providers
```

### Delete Shop Provider

```http
DELETE /api/v1/shops/{shopId}/providers/{providerId}
```

## Rate Limits

- 100 requests per minute per shop
- Webhook callbacks: 1000 per hour per shop

## Error Handling

Standard error responses follow RFC 7807 Problem Details format.
