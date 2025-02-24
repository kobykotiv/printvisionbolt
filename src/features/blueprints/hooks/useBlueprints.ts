import { useState, useCallback, useEffect } from 'react';
import { blueprintService } from '../services/blueprintService';
import { configManager } from '../config/environment';
import { logger } from '../utils/logger';
import { 
  Blueprint, 
  BlueprintSearchParams 
} from '../types/blueprint';
import { ValidationResult } from '../types/provider';
import { 
  BlueprintError, 
  AuthenticationError, 
  ProviderUnavailableError,
  RateLimitError 
} from '../types/errors';

export interface UseBlueprintsState {
  blueprints: Blueprint[];
  isLoading: boolean;
  error: Error | null;
  totalResults: number;
  currentPage: number;
  hasNextPage: boolean;
  searchParams: BlueprintSearchParams;
  isInitialized: boolean;
  availableProviders: Map<string, boolean>;
}

export interface UseBlueprintsOptions {
  providerId?: string;
  initialSearch?: BlueprintSearchParams;
  autoLoad?: boolean;
}

export function useBlueprints(options: UseBlueprintsOptions = {}) {
  const [state, setState] = useState<UseBlueprintsState>({
    blueprints: [],
    isLoading: false,
    error: null,
    totalResults: 0,
    currentPage: 1,
    hasNextPage: false,
    searchParams: options.initialSearch || {},
    isInitialized: false,
    availableProviders: new Map()
  });

  const [selectedBlueprint, setSelectedBlueprint] = useState<Blueprint | null>(null);

  // Initialize blueprint service
  const initialize = useCallback(async () => {
    try {
      setState(current => ({ ...current, isLoading: true, error: null }));
      await blueprintService.initialize();

      // Check provider availability
      const availability = await blueprintService.checkAvailability();
      
      // Log provider availability in debug mode
      if (configManager.getConfig().features.debugMode) {
        logger.debug('Provider availability status:', {
          providers: Object.fromEntries(availability),
          timestamp: new Date().toISOString()
        });
      }

      setState(current => ({
        ...current,
        isInitialized: true,
        availableProviders: availability,
        isLoading: false
      }));

      // If autoLoad is enabled, load blueprints immediately after initialization
      if (options.autoLoad) {
        loadBlueprints();
      }
    } catch (error) {
      setState(current => ({
        ...current,
        error: error instanceof Error ? error : new Error('Failed to initialize blueprint service'),
        isLoading: false
      }));
    }
  }, [options.autoLoad]);

  // Load blueprints with current search parameters
  const loadBlueprints = useCallback(async (params?: Partial<BlueprintSearchParams>) => {
    if (!state.isInitialized) {
      throw new Error('Blueprint service not initialized');
    }

    const startTime = Date.now();
    setState(current => ({ ...current, isLoading: true, error: null }));

    try {
      const searchParams = {
        ...state.searchParams,
        ...params,
        page: params?.page || state.currentPage,
        providerId: options.providerId
      };

      const result = await blueprintService.searchBlueprints(searchParams);

      // Log request metrics in debug mode
      if (configManager.getConfig().features.debugMode) {
        const duration = Date.now() - startTime;
        logger.debug('Blueprint search metrics:', {
          duration,
          totalResults: result.total,
          returnedResults: result.items.length,
          params: searchParams,
          providerId: options.providerId,
          timestamp: new Date().toISOString()
        });
      }

      setState(current => ({
        ...current,
        blueprints: params?.page === 1 ? result.items : [...current.blueprints, ...result.items],
        totalResults: result.total,
        currentPage: result.page,
        hasNextPage: result.hasMore,
        searchParams,
        isLoading: false
      }));
    } catch (error) {
      let errorMessage = 'Failed to load blueprints';
      if (error instanceof AuthenticationError) {
        errorMessage = `Authentication failed for provider ${error.providerId}`;
      } else if (error instanceof ProviderUnavailableError) {
        errorMessage = `Provider ${error.providerId} is currently unavailable`;
      } else if (error instanceof RateLimitError) {
        errorMessage = `Rate limit exceeded for provider ${error.providerId}. Retry after ${new Date(error.resetAt).toLocaleTimeString()}`;
      } else if (error instanceof BlueprintError) {
        errorMessage = error.message;
      }

      setState(current => ({
        ...current,
        error: new Error(errorMessage),
        isLoading: false
      }));

      // Log error details
      logger.error('Blueprint loading error', error instanceof Error ? error : new Error(errorMessage), {
        duration: Date.now() - startTime,
        params,
        providerId: options.providerId
      });
    }
  }, [options.providerId, state.searchParams, state.currentPage, state.isInitialized]);

  // Load next page of results
  const loadNextPage = useCallback(() => {
    if (state.hasNextPage && !state.isLoading) {
      loadBlueprints({ page: state.currentPage + 1 });
    }
  }, [state.hasNextPage, state.isLoading, state.currentPage, loadBlueprints]);

  // Refresh current results
  const refresh = useCallback(() => {
    loadBlueprints({ page: 1 });
  }, [loadBlueprints]);

  // Update search parameters
  const updateSearch = useCallback((params: Partial<BlueprintSearchParams>) => {
    loadBlueprints({ ...params, page: 1 });
  }, [loadBlueprints]);

  // Load blueprint details
  const loadBlueprintDetails = useCallback(async (blueprintId: string, providerId: string) => {
    if (!state.isInitialized) {
      throw new Error('Blueprint service not initialized');
    }

    const startTime = Date.now();
    setState(current => ({ ...current, isLoading: true, error: null }));

    try {
      const blueprint = await blueprintService.getBlueprintDetails(providerId, blueprintId);
      setSelectedBlueprint(blueprint);

      // Log details request in debug mode
      if (configManager.getConfig().features.debugMode) {
        logger.debug('Blueprint details loaded:', {
          duration: Date.now() - startTime,
          blueprintId,
          providerId,
          variantCount: blueprint.variants.length,
          timestamp: new Date().toISOString()
        });
      }

      setState(current => ({ ...current, isLoading: false }));
      return blueprint;
    } catch (error) {
      const errorMessage = error instanceof BlueprintError ? error.message : 'Failed to load blueprint details';
      setState(current => ({
        ...current,
        error: new Error(errorMessage),
        isLoading: false
      }));

      // Log error details
      logger.error('Blueprint details error', error instanceof Error ? error : new Error(errorMessage), {
        duration: Date.now() - startTime,
        blueprintId,
        providerId
      });

      throw error;
    }
  }, [state.isInitialized]);

  // Validate blueprint data
  const validateBlueprint = useCallback(async (
    providerId: string,
    blueprint: Partial<Blueprint>
  ): Promise<ValidationResult> => {
    if (!state.isInitialized) {
      throw new Error('Blueprint service not initialized');
    }

    const startTime = Date.now();

    try {
      const result = await blueprintService.validateBlueprint(providerId, blueprint);

      // Log validation result in debug mode
      if (configManager.getConfig().features.debugMode) {
        logger.debug('Blueprint validation:', {
          duration: Date.now() - startTime,
          providerId,
          isValid: result.isValid,
          errorCount: result.errors.length,
          errors: result.errors,
          blueprint: {
            id: blueprint.id,
            providerId: blueprint.providerId,
            name: blueprint.name
          },
          timestamp: new Date().toISOString()
        });
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof BlueprintError ? error.message : 'Failed to validate blueprint';
      
      // Log validation error
      logger.error('Blueprint validation error', error instanceof Error ? error : new Error(errorMessage), {
        duration: Date.now() - startTime,
        providerId,
        blueprint: {
          id: blueprint.id,
          providerId: blueprint.providerId,
          name: blueprint.name
        }
      });
      
      throw new Error(errorMessage);
    }
  }, [state.isInitialized]);

  // Initialize on mount
  useEffect(() => {
    initialize();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Monitor provider availability changes
  useEffect(() => {
    if (state.isInitialized && configManager.getConfig().features.debugMode) {
      const checkAvailability = async () => {
        try {
          const availability = await blueprintService.checkAvailability();
          const changes = Array.from(availability.entries()).filter(
            ([providerId, isAvailable]) => state.availableProviders.get(providerId) !== isAvailable
          );

          if (changes.length > 0) {
            logger.debug('Provider availability changed:', {
              changes: Object.fromEntries(changes),
              timestamp: new Date().toISOString()
            });

            setState(current => ({
              ...current,
              availableProviders: availability
            }));
          }
        } catch (error) {
          logger.error('Failed to check provider availability', error instanceof Error ? error : undefined);
        }
      };

      const interval = setInterval(checkAvailability, 30000); // Check every 30 seconds
      return () => clearInterval(interval);
    }
  }, [state.isInitialized, state.availableProviders]);

  return {
    // State
    blueprints: state.blueprints,
    isLoading: state.isLoading,
    error: state.error,
    totalResults: state.totalResults,
    currentPage: state.currentPage,
    hasNextPage: state.hasNextPage,
    searchParams: state.searchParams,
    isInitialized: state.isInitialized,
    availableProviders: state.availableProviders,
    selectedBlueprint,

    // Actions
    loadBlueprints,
    loadNextPage,
    refresh,
    updateSearch,
    loadBlueprintDetails,
    validateBlueprint,
    setSelectedBlueprint,

    // Provider status helpers
    isProviderEnabled: useCallback(
      (providerId: string) => configManager.isProviderEnabled(providerId),
      []
    ),
    getProviderConfig: useCallback(
      (providerId: string) => configManager.getProviderConfig(providerId),
      []
    )
  };
}