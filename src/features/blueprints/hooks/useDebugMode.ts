import { useState, useEffect, useCallback } from 'react';
import { logger } from '../utils/logger';

const DEBUG_MODE_KEY = 'blueprint_debug_mode';

export function useDebugMode() {
  const [isDebugMode, setIsDebugMode] = useState(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(DEBUG_MODE_KEY);
      return stored === 'true';
    }
    return false;
  });

  useEffect(() => {
    // Initialize logger state on mount
    if (isDebugMode) {
      logger.enableDebug();
    } else {
      logger.disableDebug();
    }
  }, []);

  const toggleDebugMode = useCallback(() => {
    setIsDebugMode((current) => {
      const newValue = !current;
      
      // Update localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(DEBUG_MODE_KEY, String(newValue));
      }

      // Update logger state
      if (newValue) {
        logger.enableDebug();
        logger.info('Debug mode enabled');
      } else {
        logger.info('Debug mode disabled');
        logger.disableDebug();
      }

      return newValue;
    });
  }, []);

  return {
    isDebugMode,
    toggleDebugMode
  };
}