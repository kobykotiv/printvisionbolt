import React from 'react';
import { Card } from '../../components/ui/Card';
import { FolderIcon, ImageIcon, FileIcon } from 'lucide-react';

const BrandAssets: React.FC = () => {
  const assetCategories = [
    { name: 'Logos', icon: ImageIcon, count: 12 },
    { name: 'Templates', icon: FileIcon, count: 8 },
    { name: 'Marketing Materials', icon: FolderIcon, count: 15 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Brand Assets</h1>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          Upload Asset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assetCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Card key={category.name} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <Icon className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.count} items</p>
                </div>
              </div>
            </Card>
          )}
        )}
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-medium mb-4">Recent Assets</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <ImageIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium">Logo_Primary.svg</p>
                <p className="text-sm text-gray-500">Updated 2 days ago</p>
              </div>
            </div>
            <button className="text-indigo-600 hover:text-indigo-700">Download</button>
          </div>
          {/* Add more recent assets here */}
        </div>
      </Card>
    </div>
  );
};

export default BrandAssets;