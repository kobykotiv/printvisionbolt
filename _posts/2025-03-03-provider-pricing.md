---
title: Print Provider Pricing Wiki
description: Comprehensive guide to print-on-demand provider pricing, including standard rates, bulk discounts, and API integration details
date: 2025-02-28
author: Print Vision Team
categories: [pricing, documentation, api]
tags: [printify, gooten, pricing, pod]
image: /assets/images/pricing-guide.jpg
---

# Print Provider Pricing Wiki

## Overview

This wiki maintains up-to-date pricing information for print-on-demand providers, particularly focusing on providers whose API doesn't expose cost data directly. Prices are regularly updated through our internal price tracking system.

## Provider Pricing Tables

### Printify

#### Standard Apparel
| Product Type | Base Cost | Printing Cost | Total Cost |
|-------------|------------|---------------|------------|
| T-Shirt     | $7.95     | $4.00         | $11.95     |
| Long Sleeve | $11.95    | $6.00         | $17.95     |
| Hoodie      | $17.95    | $8.00         | $25.95     |
| Tank Top    | $7.95     | $4.00         | $11.95     |

#### Premium Apparel
| Product Type | Base Cost | Printing Cost | Total Cost |
|-------------|------------|---------------|------------|
| Premium Tee | $9.95     | $4.00         | $13.95     |
| Premium Hoodie | $21.95 | $8.00         | $29.95     |

#### All-Over Print Items
| Product Type | Base Cost | Printing Cost | Total Cost |
|-------------|------------|---------------|------------|
| AOP T-Shirt | $15.95    | $8.00         | $23.95     |
| AOP Hoodie  | $25.95    | $12.00        | $37.95     |
| AOP Dress   | $21.95    | $10.00        | $31.95     |

### Gooten

#### Basic Apparel
| Product Type | Base Cost | Printing Cost | Total Cost |
|-------------|------------|---------------|------------|
| Basic Tee   | $8.50     | $3.50         | $12.00     |
| Long Sleeve | $12.50    | $5.50         | $18.00     |
| Sweatshirt  | $18.50    | $7.50         | $26.00     |

#### Premium Items
| Product Type | Base Cost | Printing Cost | Total Cost |
|-------------|------------|---------------|------------|
| Premium Tee | $10.50    | $3.50         | $14.00     |
| Designer Hoodie | $22.50 | $7.50        | $30.00     |

## Price Update Process

### Automated Updates
- Prices are automatically updated weekly through our provider integration system
- Historical pricing data is maintained for trend analysis
- Notifications are sent when significant price changes occur

### Manual Verification
- Regular cross-reference with provider dashboards
- Verification of special pricing and bulk discounts
- Quality assurance checks on pricing accuracy

## Bulk Pricing

### Volume Discounts
| Order Quantity | Discount % |
|---------------|------------|
| 10-49 items   | 5%        |
| 50-99 items   | 10%       |
| 100+ items    | 15%       |

### Seasonal Adjustments
- Holiday season surcharges may apply
- Peak season pricing variations
- Special promotion periods

## Additional Costs

### Shipping
- Domestic shipping rates
- International shipping options
- Express delivery charges

### Product Extras
- Size surcharges (2XL+)
- Special printing techniques
- Premium packaging options

## API Integration

```typescript
interface PricingData {
  provider: string;
  productType: string;
  baseCost: number;
  printingCost: number;
  totalCost: number;
  lastUpdated: Date;
}

// Fetch current pricing
async function getProductPricing(
  provider: string,
  productType: string
): Promise<PricingData>;

// Subscribe to price updates
function subscribeToPriceUpdates(
  callback: (update: PricingData) => void
): Unsubscribe;
```

## Price Calculation Guidelines

### Basic Formula
```typescript
const totalCost = baseCost + printingCost + (extras || 0);
const recommendedRetail = totalCost * markupMultiplier;
```

### Markup Recommendations
- Standard markup: 2.5x cost
- Premium items: 2.2x cost
- Custom designs: 2.8x cost

## Update History

| Date | Provider | Change Description |
|------|----------|-------------------|
| 2025-02-28 | Printify | Updated base costs for premium items |
| 2025-02-15 | Gooten | Added new product categories |
| 2025-02-01 | All | Quarterly price adjustment |

## Notes

1. All prices are in USD
2. Prices may vary by region
3. Bulk order discounts subject to availability
4. Special pricing available for enterprise accounts