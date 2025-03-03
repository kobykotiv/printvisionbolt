import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { PublicRoute } from './components/PublicRoute';
import { ProtectedRoute } from './components/ProtectedRoute';
import Landing from './pages/Landing';
import {SignIn} from './pages/SignIn';
import SignUp from './pages/SignUp';
import {ForgotPassword} from './pages/ForgotPassword';
import {Dashboard} from './pages/Dashboard';
import Collections from './pages/Collections';
import { CollectionDetails } from './pages/CollectionDetails';
import { Templates } from './pages/Templates';
import { TemplateDetails } from './pages/TemplateDetails';
import { Designs } from './pages/Designs';
import BrandAssets from './pages/brand-assets';
import { Products } from './pages/Products';
import { BulkUpload } from './pages/BulkUpload';
import { Settings } from './pages/Settings';
import { default as StoresPage } from './pages/stores';
import { default as DropsPage } from './pages/drops';
import { default as SyncStatusPage } from './pages/sync';

export function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicRoute><Outlet /></PublicRoute>}>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
        <Route path="/app">
          <Route index element={<Dashboard />} />
          {/* Content Management */}
          <Route path="collections" element={<Collections />} />
          <Route path="collections/:id" element={<CollectionDetails />} />
          <Route path="templates" element={<Templates />} />
          <Route path="templates/:id" element={<TemplateDetails />} />
          <Route path="designs" element={<Designs />} />
          <Route path="brand-assets" element={<BrandAssets />} />
          
          {/* POD Management */}
          <Route path="stores" element={<StoresPage />} />
          <Route path="products" element={<Products />} />
          <Route path="drops" element={<DropsPage />} />
          <Route path="sync" element={<SyncStatusPage />} />
          
          {/* Admin & Settings */}
          <Route path="bulk-upload" element={<BulkUpload />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>

      {/* Fallback Route */}
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/app" : "/"} replace />} 
      />
    </Routes>
  );
}

export default AppRoutes;