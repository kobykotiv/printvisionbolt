import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Image,
  Package,
  ChevronRight,
  User,
  ChevronDown,
  LucideIcon
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { LoginWidget } from '../auth/LoginWidget';

interface LayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  items?: NavItem[];
}

export function CMSLayout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  // If user is not authenticated, show login widget
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoginWidget />
      </div>
    );
  }

  const navigation: NavItem[] = [
    {
      id: 'brand-assets',
      label: 'Brand Assets',
      icon: Image,
      items: [
        { id: 'logos', label: 'Logos', icon: Image },
        { id: 'templates', label: 'Templates', icon: Package },
        { id: 'guidelines', label: 'Guidelines', icon: Package }
      ]
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

        {/* User Menu */}
        <div className="p-4 border-t border-gray-200">
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 text-sm hover:bg-gray-50 rounded-md p-2 w-full"
            >
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <User className="h-4 w-4 text-indigo-600" />
              </div>
              <span className="text-gray-700 flex-1 text-left">{user.email}</span>
              <ChevronDown className={cn(
                "h-4 w-4 text-gray-400 transition-transform",
                showUserMenu && "transform rotate-180"
              )} />
            </button>

            {showUserMenu && (
              <div className="absolute bottom-full left-0 mb-2 w-full bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                <button
                  onClick={() => {
                    signOut();
                    navigate('/');
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}