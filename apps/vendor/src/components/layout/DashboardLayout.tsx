'use client';

import React from 'react';
import { SideNav } from '../nav/SideNav';
import { GlassCard } from '@printvisionbolt/shared-ui/components/glass';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="h-screen flex gap-6 p-6">
      <aside className="hidden lg:block">
        <SideNav />
      </aside>
      <main className="flex-1 overflow-auto">
        <GlassCard className="p-6 min-h-full">
          {children}
        </GlassCard>
      </main>
    </div>
  );
}