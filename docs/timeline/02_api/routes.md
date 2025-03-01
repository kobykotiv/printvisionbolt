# API Routes Structure

## Authentication Routes

```typescript
// Base path: /api/auth
{
  "/register": {
    POST: "Register new vendor account"
  },
  "/login": {
    POST: "Vendor login"
  },
  "/verify": {
    POST: "Verify email address"
  }
}
```

## Vendor Routes

```typescript
// Base path: /api/vendor
{
  "/profile": {
    GET: "Get vendor profile",
    PUT: "Update vendor profile"
  },
  "/templates": {
    GET: "List product templates (with pagination)",
    POST: "Create new product template",
    "/:id": {
      GET: "Get single product template",
      PUT: "Update product template",
      DELETE: "Delete product template"
    }
  },
  "/orders": {
    GET: "List orders (with pagination)",
    "/bulk": {
      PUT: "Bulk update orders"
    },
    "/:id": {
      GET: "Get single order",
      PUT: "Update order status"
    }
  }
}
```

## Blueprint Cache Fetch and Search








## Tier-Specific Limits

### Free Tier

- Up to 5 items per supplier/template
- Up to 3 templates
- Upload up to 10 designs/day
- Ad supported

### Creator Tier

- $1/month
- Up to 10 items per supplier/template
- Up to 10 templates
- Unlimited uploading
- No ads

### Pro Tier

- $9/month
- Up to 30 items per supplier/template
- Up to 20 templates
- Unlimited uploading
- No ads

### Enterprise Tier

- $29/month
- Unlimited items per template
- Unlimited templates
- Unlimited uploading
- No ads


**User:** ## Admin UI Features by Tier

The admin UI provides different levels of access and features based on the subscription tier.

### Free Tier

- **Dashboard**: Displays basic analytics, such as total items, remaining template slots, and daily upload count. Adverts are displayed.
- **Template Management**: Limited to creating and managing up to 3 templates. Each template can hold up to 5 items.
- **Design Upload**: Users can upload up to 10 designs per day.
- **Support**: Access to basic support channels.

### Creator Tier

- **Dashboard**: Enhanced analytics with more detailed insights. No ads are displayed.
- **Template Management**: Increased limit of up to 10 templates, with each template holding up to 10 items.
- **Unlimited Design Upload**: No daily limits on design uploads.
- **Support**: Priority support over Free Tier users.

### Pro Tier

- **Dashboard**: Comprehensive analytics with advanced reporting features.
- **Template Management**: Up to 20 templates, with each template holding up to 30 items.
- **Unlimited Design Upload**: No daily limits on design uploads.
- **Support**: Dedicated support channel.

### Enterprise Tier

- **Dashboard**: Fully customizable dashboard with real-time data and custom reports.
- **Template Management**: Unlimited templates and items per template.
- **Unlimited Design Upload**: No restrictions on design uploads.
- **Support**: 24/7 premium support with a dedicated account manager.



