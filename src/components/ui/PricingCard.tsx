import React from 'react';
import Button from './Button';

interface Feature {
  name: string;
  included: boolean;
}

interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: Feature[];
  highlighted?: boolean;
  onSelect: () => void;
}

const PricingCard: React.FC<PricingCardProps> = ({
  name,
  price,
  period = '/month',
  description,
  features,
  highlighted = false,
  onSelect,
}) => {
  return (
    <div
      className={`
        relative rounded-2xl p-8 shadow-lg flex flex-col
        ${highlighted ? 'border-2 border-blue-500' : 'border border-gray-200'}
      `}
    >
      {highlighted && (
        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-500 text-white text-sm rounded-full px-4 py-1">
            Most Popular
          </span>
        </div>
      )}

      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900">{name}</h3>
        <div className="mt-4 flex justify-center items-baseline">
          <span className="text-5xl font-extrabold text-gray-900">{price}</span>
          <span className="ml-1 text-xl font-semibold text-gray-500">{period}</span>
        </div>
        <p className="mt-6 text-gray-500">{description}</p>
      </div>

      <ul className="mt-6 space-y-4 flex-1">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <span className={`flex-shrink-0 h-6 w-6 ${feature.included ? 'text-green-500' : 'text-gray-300'}`}>
              {feature.included ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </span>
            <span className={`ml-3 text-base ${feature.included ? 'text-gray-700' : 'text-gray-500'}`}>
              {feature.name}
            </span>
          </li>
        ))}
      </ul>

      <Button
        variant={highlighted ? 'primary' : 'outline'}
        size="lg"
        className="mt-8 w-full"
        onClick={onSelect}
      >
        Get Started
      </Button>
    </div>
  );
};

export default PricingCard;