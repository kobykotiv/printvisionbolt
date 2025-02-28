import type { Blueprint } from '../types/template';
import type { SubscriptionTier } from '../types/subscription';
import { TIER_LIMITS } from '../types/subscription';

interface ValidationResult {
  isValid: boolean;
  error?: string;
  remainingAllocation?: number;
}

interface BlueprintValidationRules {
  maxBlueprints: number;
  allowedProviders: string[];
  allowedTypes: string[];
  maxPrintAreas: number;
  maxVariants: number;
}

const TIER_VALIDATION_RULES: Record<SubscriptionTier, BlueprintValidationRules> = {
  free: {
    maxBlueprints: 3,
    allowedProviders: ['printify'],
    allowedTypes: ['t-shirt', 'hoodie'],
    maxPrintAreas: 2,
    maxVariants: 5
  },
  creator: {
    maxBlueprints: 10,
    allowedProviders: ['printify', 'printful'],
    allowedTypes: ['t-shirt', 'hoodie', 'mug', 'poster'],
    maxPrintAreas: 4,
    maxVariants: 10
  },
  pro: {
    maxBlueprints: 50,
    allowedProviders: ['printify', 'printful', 'gooten'],
    allowedTypes: ['t-shirt', 'hoodie', 'mug', 'poster', 'phone-case', 'canvas'],
    maxPrintAreas: 8,
    maxVariants: 20
  },
  enterprise: {
    maxBlueprints: -1, // Unlimited
    allowedProviders: ['printify', 'printful', 'gooten', 'gelato'],
    allowedTypes: [], // All types allowed
    maxPrintAreas: -1, // Unlimited
    maxVariants: -1 // Unlimited
  }
};

export class BlueprintValidationService {
  validateBlueprintAddition(
    blueprint: Blueprint,
    currentBlueprints: Blueprint[],
    tier: SubscriptionTier
  ): ValidationResult {
    const rules = TIER_VALIDATION_RULES[tier];

    // Check blueprint count limit
    if (rules.maxBlueprints !== -1) {
      const remaining = rules.maxBlueprints - currentBlueprints.length;
      if (remaining <= 0) {
        return {
          isValid: false,
          error: `Your ${tier} plan is limited to ${rules.maxBlueprints} blueprints. Please upgrade to add more.`,
          remainingAllocation: 0
        };
      }
    }

    // Check provider restriction
    if (rules.allowedProviders.length > 0 && !rules.allowedProviders.includes(blueprint.provider)) {
      return {
        isValid: false,
        error: `The ${blueprint.provider} provider is not available on your ${tier} plan. Available providers: ${rules.allowedProviders.join(', ')}`
      };
    }

    // Check print areas limit
    if (rules.maxPrintAreas !== -1 && blueprint.placeholders.length > rules.maxPrintAreas) {
      return {
        isValid: false,
        error: `This blueprint has ${blueprint.placeholders.length} print areas. Your ${tier} plan is limited to ${rules.maxPrintAreas} print areas per blueprint.`
      };
    }

    // Check variants limit
    if (rules.maxVariants !== -1 && blueprint.variants.length > rules.maxVariants) {
      return {
        isValid: false,
        error: `This blueprint has ${blueprint.variants.length} variants. Your ${tier} plan is limited to ${rules.maxVariants} variants per blueprint.`
      };
    }

    // Calculate remaining allocation
    const remainingAllocation = rules.maxBlueprints === -1 
      ? -1 
      : rules.maxBlueprints - currentBlueprints.length - 1;

    return {
      isValid: true,
      remainingAllocation
    };
  }

  validateBlueprintBatch(
    blueprints: Blueprint[],
    currentBlueprints: Blueprint[],
    tier: SubscriptionTier
  ): ValidationResult[] {
    return blueprints.map(blueprint => 
      this.validateBlueprintAddition(
        blueprint,
        [...currentBlueprints, ...blueprints.filter(b => b.id !== blueprint.id)],
        tier
      )
    );
  }

  getUsageStats(
    currentBlueprints: Blueprint[],
    tier: SubscriptionTier
  ) {
    const rules = TIER_VALIDATION_RULES[tier];
    const limits = TIER_LIMITS[tier];

    return {
      blueprints: {
        used: currentBlueprints.length,
        total: rules.maxBlueprints,
        remaining: rules.maxBlueprints === -1 
          ? -1 
          : rules.maxBlueprints - currentBlueprints.length
      },
      providers: {
        allowed: rules.allowedProviders,
        usage: currentBlueprints.reduce((acc, bp) => {
          acc[bp.provider] = (acc[bp.provider] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      },
      printAreas: {
        max: rules.maxPrintAreas,
        usage: currentBlueprints.reduce((acc, bp) => {
          acc.total += bp.placeholders.length;
          acc.byBlueprint[bp.id] = bp.placeholders.length;
          return acc;
        }, { total: 0, byBlueprint: {} as Record<string, number> })
      },
      variants: {
        max: rules.maxVariants,
        usage: currentBlueprints.reduce((acc, bp) => {
          acc.total += bp.variants.length;
          acc.byBlueprint[bp.id] = bp.variants.length;
          return acc;
        }, { total: 0, byBlueprint: {} as Record<string, number> })
      }
    };
  }
}

export const blueprintValidationService = new BlueprintValidationService();