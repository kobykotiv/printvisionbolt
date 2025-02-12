import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Folder,
  Image,
  Package,
  Settings,
  ChevronRight,
  Plus,
  RefreshCw,
  Filter,
  Grid,
  List,
  Command
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  items?: NavItem[];
}

export function CMSLayout({ children }: LayoutProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [showShortcuts, setShowShortcuts] = React.useState(false);

  const navigation: NavItem[] = [
    {
      id: 'brand-assets',
      label: 'Brand Assets',
      icon: Image,
      items: [
        { id: 'logos', label: 'Logos', icon: Image },
        { id: 'templates', label: 'Templates', icon: Folder },
        { id: 'guidelines', label: 'Guidelines', icon: Folder }
      ]
    },
    {
      id: 'products',
      label: 'Products',
      icon: Package,
      items: [
        { id: 'active', label: 'Active', icon: Package },
        { id: 'drafts', label: 'Drafts', icon: Package },
        { id: 'archived', label: 'Archived', icon: Package }
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings
    }
  ];

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const renderNavItem = (item: NavItem, depth = 0) => (
    <div key={item.id} className="relative">
      <button
        onClick={() => toggleExpanded(item.id)}
        className={cn(
          "w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md",
          depth > 0 && "ml-4"
        )}
      >
        <item.icon className="h-4 w-4" />
        <span className="flex-1 text-left">{item.label}</span>
        {item.items && (
          <ChevronRight
            className={cn(
              "h-4 w-4 transition-transform",
              expandedItems.includes(item.id) && "transform rotate-90"
            )}
          />
        )}
      </button>
      {item.items && expandedItems.includes(item.id) && (
        <div className="mt-1">
          {item.items.map(subItem => renderNavItem(subItem, depth + 1))}
        </div>
      )}
    </div>
  );

  const shortcuts = [
    { key: '⌘ K', description: 'Quick search' },
    { key: '⌘ N', description: 'New item' },
    { key: '⌘ S', description: 'Save changes' },
    { key: '⌘ /', description: 'Show shortcuts' },
    { key: 'Tab', description: 'Navigate items' },
    { key: 'Space', description: 'Select item' },
  ];

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setShowShortcuts(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Left Sidebar */}
      <div className="w-64 flex flex-col bg-white border-r border-gray-200">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Quick search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto">
          {navigation.map(item => renderNavItem(item))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                <Plus className="h-4 w-4 mr-1" />
                New Item
              </button>
              <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  "p-1.5 rounded-md",
                  viewMode === 'grid'
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:bg-gray-50"
                )}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "p-1.5 rounded-md",
                  viewMode === 'list'
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:bg-gray-50"
                )}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setShowShortcuts(true)}
                className="p-1.5 rounded-md text-gray-500 hover:bg-gray-50"
              >
                <Command className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>

      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Keyboard Shortcuts</h2>
              <button
                onClick={() => setShowShortcuts(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-2">
              {shortcuts.map(({ key, description }) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-gray-600">{description}</span>
                  <kbd className="px-2 py-1 text-sm font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded">
                    {key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}