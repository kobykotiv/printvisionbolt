import React, { useEffect, useState } from 'react';
import { Blueprint } from '../../types/blueprint';
import { Button } from '../../../../../components/ui/Button';

interface BlueprintDetailsProps {
  blueprint: Blueprint;
  isOpen: boolean;
  onClose: () => void;
}

export function BlueprintDetails({ blueprint, isOpen, onClose }: BlueprintDetailsProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(onClose, 200); // Wait for animation to complete
  };

  if (!isOpen && !isAnimating) return null;

  return (
    <div className={`fixed inset-0 z-50 transition-opacity duration-200 ${
      isAnimating ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className={`absolute inset-4 lg:inset-32 bg-white rounded-lg shadow-xl transform transition-all duration-200 ${
        isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Blueprint Details</h2>
          <Button
            variant="ghost"
            label="×"
            onClick={handleClose}
            className="text-2xl"
          />
        </div>

        <div className="overflow-auto p-6 max-h-[calc(100vh-200px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Images */}
            <div>
              <div className="aspect-w-1 aspect-h-1 mb-4 bg-gray-100 rounded-lg overflow-hidden">
                {blueprint.images[0] && (
                  <img
                    src={blueprint.images[0].url}
                    alt={blueprint.name}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {blueprint.images.slice(1).map((image) => (
                  <div
                    key={image.id}
                    className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <img
                      src={image.url}
                      alt={blueprint.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{blueprint.name}</h1>
                <p className="text-gray-600">{blueprint.description}</p>
              </div>

              {/* Provider Info */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Provider</h3>
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium capitalize">
                    {blueprint.providerId}
                  </span>
                  <span className="text-sm text-gray-500">
                    ID: {blueprint.sku}
                  </span>
                </div>
              </div>

              {/* Variants */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Available Variants</h3>
                <div className="space-y-2">
                  {blueprint.variants.map((variant) => (
                    <div
                      key={variant.id}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div>
                        <p className="font-medium">{variant.name}</p>
                        <p className="text-sm text-gray-500">
                          {Object.entries(variant.attributes)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join(', ')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ${variant.price.amount.toFixed(2)} {variant.price.currency}
                        </p>
                        <p className="text-sm text-gray-500">
                          Stock: {variant.stock}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Printing Options */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Printing Options</h3>
                <div className="space-y-2">
                  {blueprint.printingOptions.map((option) => (
                    <div
                      key={option.id}
                      className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <p className="font-medium capitalize">{option.technique}</p>
                      <p className="text-sm text-gray-500">
                        Locations: {option.locations.join(', ')}
                      </p>
                      <p className="text-sm text-gray-500">
                        DPI: {option.constraints.minDpi} - {option.constraints.maxDpi}
                      </p>
                      <p className="text-sm text-gray-500">
                        Size: {option.constraints.width}x{option.constraints.height}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Production Time */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Production Time</h3>
                <div className="px-3 py-2 bg-green-50 text-green-700 rounded-lg inline-block">
                  {blueprint.productionTime.min}-{blueprint.productionTime.max} {blueprint.productionTime.unit}
                </div>
              </div>

              {/* Metadata */}
              <div className="text-sm text-gray-500 pt-4 border-t">
                <p>Created: {new Date(blueprint.metadata.createdAt).toLocaleDateString()}</p>
                <p>Updated: {new Date(blueprint.metadata.updatedAt).toLocaleDateString()}</p>
                {blueprint.metadata.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {blueprint.metadata.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-2 bg-gray-50">
          <Button
            variant="outline"
            label="Close"
            onClick={handleClose}
          />
          <Button
            variant="primary"
            label="Use Blueprint"
            onClick={() => console.log('Use blueprint:', blueprint.id)}
          />
        </div>
      </div>
    </div>
  );
}