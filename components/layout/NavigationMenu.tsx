import { NavLink } from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  IconDashboard,
  IconShoppingCart,
  IconPalette,
  IconFolder,
  IconSync,
  IconSettings,
} from '@tabler/icons-react';

export function NavigationMenu() {
  const router = useRouter();

  const links = [
    { href: '/app/dashboard', label: 'Dashboard', icon: IconDashboard },
    { href: '/app/shops', label: 'Shops', icon: IconShoppingCart },
    { href: '/app/designs', label: 'Designs', icon: IconPalette },
    { href: '/app/collections', label: 'Collections', icon: IconFolder },
    { href: '/app/sync', label: 'Sync', icon: IconSync },
    { href: '/app/settings', label: 'Settings', icon: IconSettings },
  ];

  const isActive = (href: string) => {
    const currentPath = router.pathname;
    if (href === '/app/dashboard') {
      return currentPath === href;
    }
    return currentPath.startsWith(href);
  };

  return (
    <nav>
      {links.map(({ href, label, icon: Icon }) => (
        <Link key={href} href={href} passHref legacyBehavior>
          <NavLink
            component="a"
            active={isActive(href)}
            label={label}
            icon={<Icon size={16} />}
          />
        </Link>
      ))}
    </nav>
  );
}
