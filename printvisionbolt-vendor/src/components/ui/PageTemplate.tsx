import React from 'react';
import { Card } from './Card';
import { LoadingState } from './LoadingState';

interface PageTemplateProps {
  title: string;
  description?: string;
  isLoading?: boolean;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export const PageTemplate: React.FC<PageTemplateProps> = ({
  title,
  description,
  isLoading = false,
  actions,
  children
}) => {
  if (isLoading) {
    return (
      <LoadingState
        type="skeleton"
        count={3}
        columns={1}
        message={`Loading ${title.toLowerCase()}...`}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center space-x-4">
            {actions}
          </div>
        )}
      </div>
      
      <Card className="p-6">
        {children}
      </Card>
    </div>
  );
};