import React from 'react';
import { Upload, Plus, FileSpreadsheet, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { NewDesignModal } from '../components/ui/NewDesignModal';
import { useShop } from '../contexts/ShopContext';
import Papa from 'papaparse';
import { supabase } from '../lib/supabase';
import { TEST_MODE } from '../lib/test-mode';

export function Designs() {
  const { currentShop } = useShop();
  const [showNewModal, setShowNewModal] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [syncStatus, setSyncStatus] = React.useState<Record<string, 'pending' | 'success' | 'error'>>({});
  const [bulkMode, setBulkMode] = React.useState<'files' | 'csv'>('files');
  const [bulkPrefix, setBulkPrefix] = React.useState('Design');
  const [bulkStartNumber, setBulkStartNumber] = React.useState(1);

  const handleFileUpload = async (acceptedFiles: File[]) => {
    try {
      if (bulkMode === 'csv' && acceptedFiles[0]?.type === 'text/csv') {
        if (TEST_MODE) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          return;
        }

        const csvFile = acceptedFiles[0];
        const text = await csvFile.text();
        const { data } = Papa.parse(text, { header: true });
        
        for (const row of data) {
          const { title, description, tags } = row;
          // Create design record with CSV data
          const { error: dbError } = await supabase.from('designs').insert({
            title: title || 'Untitled Design',
            description: description || null,
            tags: tags ? tags.split(',').map((t: string) => t.trim()) : [],
            shop_id: currentShop?.id,
            file_url: '', // You'll need to handle file uploads separately
          });
          if (dbError) throw dbError;
        }
      } else {
        let counter = bulkStartNumber;
        for (const file of acceptedFiles) {
          if (!file.type.startsWith('image/')) continue;
          
          if (TEST_MODE) {
            await new Promise(resolve => setTimeout(resolve, 500));
            continue;
          }

          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `${currentShop?.id}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('designs')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { error: dbError } = await supabase.from('designs').insert({
            title: bulkMode === 'files' ? file.name : `${bulkPrefix} ${counter++}`,
            file_url: filePath,
            shop_id: currentShop?.id,
            tags: [],
          });

          if (dbError) throw dbError;
        }
      }
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.svg'],
      'text/csv': ['.csv']
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    onDrop: (acceptedFiles) => {
      setUploading(true);
      handleFileUpload(acceptedFiles).catch(console.error);
    }
  });

  const syncWithSupplier = async (designId: string, supplier: 'printify' | 'printful' | 'gooten') => {
    setSyncStatus(prev => ({ ...prev, [designId]: 'pending' }));
    try {
      if (TEST_MODE) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setSyncStatus(prev => ({ ...prev, [designId]: 'success' }));
        return;
      }

      // Log sync attempt
      const { error: logError } = await supabase.from('sync_logs').insert({
        shop_id: currentShop?.id,
        design_id: designId,
        supplier,
        status: 'pending'
      });
      if (logError) throw logError;

      // Simulate API call to supplier
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update sync status
      const { error: updateError } = await supabase.from('sync_logs').update({
        status: 'success'
      }).eq('design_id', designId).eq('status', 'pending');
      
      if (updateError) throw updateError;
      setSyncStatus(prev => ({ ...prev, [designId]: 'success' }));
    } catch (error) {
      console.error('Sync error:', error);
      setSyncStatus(prev => ({ ...prev, [designId]: 'error' }));
      
      // Log error
      await supabase.from('sync_logs').update({
        status: 'error',
        error_message: error.message
      }).eq('design_id', designId).eq('status', 'pending');
    }
  };

  const designs = [
    {
      id: 1,
      title: 'Summer Vibes',
      thumbnail: 'https://images.unsplash.com/photo-1513346940221-6f673d962e97?auto=format&fit=crop&q=80&w=400',
      tags: ['summer', 'beach', 'vacation'],
      createdAt: '2024-02-20',
    },
    {
      id: 2,
      title: 'Mountain Adventure',
      thumbnail: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=400',
      tags: ['nature', 'mountain', 'adventure'],
      createdAt: '2024-02-19',
    },
    // Add more designs...
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Designs</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setBulkMode(mode => mode === 'files' ? 'csv' : 'files')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            {bulkMode === 'files' ? (
              <>
                <FileSpreadsheet className="h-5 w-5 mr-2" />
                Switch to CSV
              </>
            ) : (
              <>
                <Upload className="h-5 w-5 mr-2" />
                Switch to Files
              </>
            )}
        </button>
        <button
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
            <Plus className="h-5 w-5 mr-2" />
            New Design
          </button>
        </div>
      </div>

      {/* Bulk Upload Settings */}
      {bulkMode === 'files' && (
        <div className="mb-4 flex gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Prefix</label>
            <input
              type="text"
              value={bulkPrefix}
              onChange={(e) => setBulkPrefix(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Number</label>
            <input
              type="number"
              value={bulkStartNumber}
              onChange={(e) => setBulkStartNumber(parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      )}

      {/* Upload Zone */}
      <div
        {...getRootProps()}
        className={`mb-8 border-2 border-dashed rounded-lg p-12 text-center ${
          uploading
            ? 'border-gray-300 bg-gray-50'
            : isDragActive
            ? 'border-indigo-500 bg-indigo-50'
            : 'border-gray-300'
        }`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto" />
            <p className="mt-2 text-sm text-gray-600">Uploading files...</p>
          </div>
        ) : (
          <>
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              {bulkMode === 'csv' 
                ? 'Drag and drop your CSV file here, or click to select file'
                : 'Drag and drop your design files here, or click to select files'}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {bulkMode === 'csv'
                ? 'CSV file with columns: title, description, tags'
                : 'PNG, JPG, SVG up to 50MB'}
            </p>
          </>
        )}
      </div>

      {/* Designs Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {designs.map((design) => (
          <div
            key={design.id}
            className="relative group bg-white rounded-lg shadow overflow-hidden"
          >
            <div className="aspect-w-4 aspect-h-3">
              <img
                src={design.thumbnail}
                alt={design.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity" />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">{design.title}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => syncWithSupplier(design.id.toString(), 'printify')}
                    className="p-1 rounded hover:bg-gray-100"
                    disabled={syncStatus[design.id] === 'pending'}
                  >
                    {syncStatus[design.id] === 'pending' ? (
                      <RefreshCw className="h-5 w-5 text-gray-400 animate-spin" />
                    ) : syncStatus[design.id] === 'success' ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : syncStatus[design.id] === 'error' ? (
                      <XCircle className="h-5 w-5 text-red-500" />
                    ) : (
                      <RefreshCw className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {design.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Created on {new Date(design.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      <NewDesignModal
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
        onSave={async (data, files) => {
          console.log('Saving design:', data, files);
          await handleFileUpload(files);
        }}
      />
    </div>
  );
}