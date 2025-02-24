import React from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BlueprintBreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function BlueprintBreadcrumbs({ items, className = '' }: BlueprintBreadcrumbsProps) {
  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <div className="flex items-center">
            <a
              href="/app/blueprints"
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <svg
                className="h-5 w-5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span className="sr-only">Home</span>
            </a>
          </div>
        </li>

        {items.map((item) => (
          <li key={item.label}>
            <div className="flex items-center">
              <svg
                className="h-5 w-5 flex-shrink-0 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
              </svg>
              {item.href ? (
                <a
                  href={item.href}
                  className="ml-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <span className="ml-2 text-sm font-medium text-gray-700">
                  {item.label}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>

      <div className="flex-1" />

      {/* Optional Debug Status Indicator */}
      <div className="hidden sm:block">
        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
          <svg 
            className="w-3 h-3 mr-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <span className="text-gray-500">Debug:</span>
          <span 
            className="ml-1 font-mono"
            data-testid="debug-mode-indicator"
          >
            {process.env.NODE_ENV}
          </span>
        </span>
      </div>
    </nav>
  );
}