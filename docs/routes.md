# API Routes Structure

## tRPC Router Configuration

```typescript
// Base configuration
interface TRPCConfig {
  selfHosted: true;
  supabase: {
    url: string;
    key: string;
    options: {
      realtime: boolean;
      selfHosted: true;
    };
  };
}

// Route definitions with type safety
const appRouter = router({
  auth: authRouter,
  vendor: vendorRouter,
  templates: templateRouter,
  orders: orderRouter,
  ui: uiRouter
});

export type AppRouter = typeof appRouter;
```

## Authentication Routes

```typescript
// Base path: /api/auth
const authRouter = router({
  register: publicProcedure
    .input(RegisterSchema)
    .mutation(async ({ input, ctx }) => {
      // Register new vendor account
    }),
  
  login: publicProcedure
    .input(LoginSchema)
    .mutation(async ({ input, ctx }) => {
      // Vendor login with self-hosted Supabase
    }),
  
  verify: protectedProcedure
    .input(VerifySchema)
    .mutation(async ({ input, ctx }) => {
      // Verify email address
    })
});
```

## Vendor Routes

```typescript
// Base path: /api/vendor
const vendorRouter = router({
  profile: {
    get: protectedProcedure.query(async ({ ctx }) => {
      // Get vendor profile
    }),
    update: protectedProcedure
      .input(ProfileSchema)
      .mutation(async ({ input, ctx }) => {
        // Update vendor profile
      })
  },
  
  templates: {
    list: protectedProcedure
      .input(PaginationSchema)
      .query(async ({ input, ctx }) => {
        // List product templates with pagination
      }),
    create: protectedProcedure
      .input(TemplateSchema)
      .mutation(async ({ input, ctx }) => {
        // Create new product template
      }),
    single: protectedProcedure
      .input(z.string())
      .query(async ({ input, ctx }) => {
        // Get single product template
      }),
    update: protectedProcedure
      .input(TemplateUpdateSchema)
      .mutation(async ({ input, ctx }) => {
        // Update product template
      }),
    delete: protectedProcedure
      .input(z.string())
      .mutation(async ({ input, ctx }) => {
        // Delete product template
      })
  },

  orders: {
    list: protectedProcedure
      .input(PaginationSchema)
      .query(async ({ input, ctx }) => {
        // List orders with pagination
      }),
    bulkUpdate: protectedProcedure
      .input(BulkUpdateSchema)
      .mutation(async ({ input, ctx }) => {
        // Bulk update orders
      }),
    single: protectedProcedure
      .input(z.string())
      .query(async ({ input, ctx }) => {
        // Get single order
      }),
    updateStatus: protectedProcedure
      .input(StatusUpdateSchema)
      .mutation(async ({ input, ctx }) => {
        // Update order status
      })
  }
});
```

## UI Customization Routes

```typescript
// Base path: /api/ui
const uiRouter = router({
  glass: {
    getEffects: protectedProcedure
      .query(async ({ ctx }) => {
        // Get glass effect settings
      }),
    updateEffects: protectedProcedure
      .input(GlassEffectSchema)
      .mutation(async ({ input, ctx }) => {
        // Update glass effect settings
      })
  },
  
  gradients: {
    list: protectedProcedure
      .query(async ({ ctx }) => {
        // List available gradients
      }),
    create: protectedProcedure
      .input(GradientSchema)
      .mutation(async ({ input, ctx }) => {
        // Create custom gradient
      }),
    update: protectedProcedure
      .input(GradientUpdateSchema)
      .mutation(async ({ input, ctx }) => {
        // Update gradient settings
      })
  }
});
```

## Tier-Specific Limits

### Free Tier

- Up to 5 items per supplier/template
- Up to 3 templates
- Upload up to 10 designs/day
- Basic glass effects
- Default gradients only
- 2GB storage (self-hosted)

### Creator Tier ($1/month)

- Up to 10 items per supplier/template
- Up to 10 templates
- Unlimited uploading
- Advanced glass effects
- Custom gradients
- 10GB storage (self-hosted)

### Pro Tier ($9/month)

- Up to 30 items per supplier/template
- Up to 20 templates
- Unlimited uploading
- Custom glass effects
- Animated gradients
- 50GB storage (self-hosted)

### Enterprise Tier ($29/month)

- Unlimited items per template
- Unlimited templates
- Unlimited uploading
- Branded glass effects
- Custom everything
- Customizable storage (self-hosted)

## Admin UI Features by Tier

### Free Tier

- **Dashboard**: Basic analytics with glass UI elements
- **Template Management**: Up to 3 templates, 5 items each
- **Design Upload**: 10 designs/day limit
- **Support**: Basic support
- **UI**: Basic glass effects, default gradients

### Creator Tier

- **Dashboard**: Enhanced analytics with advanced glass UI
- **Template Management**: Up to 10 templates, 10 items each
- **Design Upload**: Unlimited
- **Support**: Priority support
- **UI**: Advanced glass effects, custom gradients

### Pro Tier

- **Dashboard**: Comprehensive analytics, custom glass UI
- **Template Management**: Up to 20 templates, 30 items each
- **Design Upload**: Unlimited
- **Support**: Dedicated support
- **UI**: Custom glass effects, animated gradients

### Enterprise Tier

- **Dashboard**: Fully customizable with branded glass UI
- **Template Management**: Unlimited
- **Design Upload**: Unlimited
- **Support**: 24/7 premium support
- **UI**: Branded glass effects, complete customization
