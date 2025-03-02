import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg p-6 
        bg-white/50 dark:bg-gray-800/50 
        backdrop-blur-lg backdrop-filter 
        border border-white/10 dark:border-gray-700/10 
        shadow-xl transition-all duration-200 
        ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}