import React from 'react';
import { Upload, Settings, BookTemplate as Template, Save } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '../lib/supabase';
import type { Template as TemplateType } from '../lib/types/template';
import type { Design } from '../lib/types/design';
import { useShop } from '../contexts/ShopContext';
import { TEST_MODE } from '../lib/test-mode';

interface BulkUploadConfig {
  prefix: string;
  startNumber: number;
  category: string;
  template?: TemplateType;
  tags: string[];
  metadata: {
    dpi: number;
    colorSpace: 'RGB' | 'CMYK';
  };
}

interface QueueItem {
  id: string;
  file: File;
  preview: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export function BulkUpload() {
  const { currentShop } = useShop();
  const [config, setConfig] = React.useState<BulkUploadConfig>({
    prefix: 'Design',
    startNumber: 1,
    category: 'Uncategorized',
    tags: [],
    metadata: {
      dpi: 300,
      colorSpace: 'RGB'
    }
  });
  const [templates, setTemplates] = React.useState<TemplateType[]>([]);
  const [queue, setQueue] = React.useState<QueueItem[]>([]);
  const [uploading, setUploading] = React.useState(false);
  const [tagInput, setTagInput] = React.useState('');

  // Load available templates
  React.useEffect(() => {
    const loadTemplates = async () => {
      if (TEST_MODE) {
        setTemplates([{
          id: 'template-1',
          title: 'Test Template',
          description: 'Test template',
          designs: [],
          blueprints: [],
          tags: ['test','foo'],
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('templates')
          .select('*')
          .eq('status', 'active');

        if (error) throw error;
        setTemplates(data || []);
      } catch (error) {
        console.error('Error loading templates:', error);
      }
    };

    loadTemplates();
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.svg']
    },
    maxSize: 50 * 1024 * 1024,
    onDrop: (acceptedFiles) => {
      const newFiles = acceptedFiles.map(file => ({
        id: Math.random().toString(36).substring(7),
        file,
        preview: URL.createObjectURL(file),
        status: 'pending' as const
      }));
      setQueue(prev => [...prev, ...newFiles]);
    }
  });

  const handleUpload = async () => {
    setUploading(true);
    let currentNumber = config.startNumber;
    const bucket = 'user_designs';

    try {
      // Ensure bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      if (!buckets?.find(b => b.name === bucket)) {
        await supabase.storage.createBucket(bucket, {
          public: false,
          fileSizeLimit: 50 * 1024 * 1024 // 50MB
        });
      }

      for (const item of queue) {
        if (item.status === 'success') continue;

        setQueue(prev => prev.map(i => 
          i.id === item.id ? { ...i, status: 'uploading' } : i
        ));

        try {
          if (TEST_MODE) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setQueue(prev => prev.map(i => 
              i.id === item.id ? { ...i, status: 'success' } : i
            ));
            currentNumber++;
            continue;
          }

          // 1. Upload file to storage
          const fileExt = item.file.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `${currentShop?.id}/${config.category}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, item.file);

          if (uploadError) throw uploadError;

          // Generate signed URL
          const { data: { signedUrl } } = await supabase.storage
            .from(bucket)
            .createSignedUrl(filePath, 365 * 24 * 60 * 60); // 1 year expiry

          // 2. Create design record
          const { data: design, error: designError } = await supabase
            .from('designs')
            .insert({
              name: `${config.prefix} ${currentNumber}`,
              category: config.category,
              tags: config.tags,
              file_url: signedUrl,
              thumbnail_url: signedUrl, // In production, generate actual thumbnail
              shop_id: currentShop?.id,
              metadata: {
                width: 0, // Will be updated by worker
                height: 0, // Will be updated by worker
                format: fileExt?.toUpperCase(),
                fileSize: item.file.size,
                dpi: config.metadata.dpi,
                colorSpace: config.metadata.colorSpace,
                hasTransparency: fileExt === 'png'
              },
              status: 'active'
            })
            .select()
            .single();

          if (designError) throw designError;

          // 3. Connect to template if selected
          if (config.template && design) {
            const { error: templateError } = await supabase
              .from('template_designs')
              .insert({
                template_id: config.template.id,
                design_id: design.id,
                status: 'pending'
              });

            if (templateError) throw templateError;
          }

          setQueue(prev => prev.map(i => 
            i.id === item.id ? { ...i, status: 'success' } : i
          ));

          currentNumber++;
        } catch (error) {
          console.error('Error processing file:', error);
          setQueue(prev => prev.map(i => 
            i.id === item.id ? { ...i, status: 'error', error: error.message } : i
          ));
        }
      }
    } finally {
      setUploading(false);
    }
  };

  const handleTagAdd = () => {
    if (tagInput.trim()) {
      setConfig(prev => ({
        ...prev,
        tags: [...new Set([...prev.tags, ...tagInput.split(',').map(t => t.trim())])]
      }));
      setTagInput('');
    }
  };

  const handleTagRemove = (tag: string) => {
    setConfig(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Bulk Upload</h1>
        <button
          onClick={handleUpload}
          disabled={uploading || queue.length === 0}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
        >
          <Save className="h-5 w-5 mr-2" />
          Start Upload ({queue.length} files)
        </button>
      </div>

      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        {/* Configuration Section */}
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Upload Configuration
          </h2>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name Prefix</label>
              <input
                type="text"
                value={config.prefix}
                onChange={(e) => setConfig(prev => ({ ...prev, prefix: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Start Number</label>
              <input
                type="number"
                value={config.startNumber}
                onChange={(e) => setConfig(prev => ({ ...prev, startNumber: parseInt(e.target.value) }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <input
                type="text"
                value={config.category}
                onChange={(e) => setConfig(prev => ({ ...prev, category: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Template</label>
              <select
                value={config.template?.id || ''}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  template: templates.find(t => t.id === e.target.value)
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">None</option>
                {templates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Tags</label>
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleTagAdd()}
                  placeholder="Add tags (comma-separated)"
                  className="block flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <button
                  onClick={handleTagAdd}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Add
                </button>
              </div>
              {config.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {config.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {tag}
                      <button
                        onClick={() => handleTagRemove(tag)}
                        className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full hover:bg-indigo-200"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upload Zone */}
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Upload className="h-5 w-5 mr-2" />
            Upload Files
          </h2>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center ${
              isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Drag and drop your design files here, or click to select files
            </p>
            <p className="mt-1 text-xs text-gray-500">
              PNG, JPG, SVG up to 50MB
            </p>
          </div>

          {queue.length > 0 && (
            <div className="mt-6 space-y-4">
              {queue.map(item => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <img
                    src={item.preview}
                    alt="Preview"
                    className="h-16 w-16 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.file.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {(item.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <div className="flex items-center">
                    {item.status === 'pending' && (
                      <span className="text-gray-500">Pending</span>
                    )}
                    {item.status === 'uploading' && (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600" />
                    )}
                    {item.status === 'success' && (
                      <span className="text-green-500">Uploaded</span>
                    )}
                    {item.status === 'error' && (
                      <span className="text-red-500" title={item.error}>
                        Error
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}