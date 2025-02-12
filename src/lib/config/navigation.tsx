import {
  LayoutDashboard,
//   ShoppingBag,
  Palette,
  FileStack,
  Settings,
  Upload,
  Images,
  User,
  Store,
//   icons,
} from 'lucide-react';

export const navigation = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'designs',
    label: 'Designs',
    path: '/designs',
    icon: Palette,
  },
  {
    id: 'bulk-upload',
    label: 'Bulk Upload',
    path: '/bulk-upload',
    icon: Upload,
  },
  {
    id: 'upload',
    label: 'Upload',
    path: '/upload',
    icon: Upload,
  },
  {
    id: 'templates',
    label: 'Templates',
    path: '/templates',
    icon: FileStack,
  },
//   {
//     id: 'products',
//     label: 'Products',
//     path: '/products',
//     icon: ShoppingBag,
//   },
  {
    id: 'brand-assets',
    label: 'Brand Assets',
    path: '/brand-assets',
    icon: Images,
  },

];

export const userMenu = [
  {
    id: 'profile',
    label: 'Profile',
    path: '/profile',
    icon: User,
  },
  {
    id: 'stores',
    label: 'Stores',
    path: '/stores',
    icon: Store,
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: Settings,
  },
];