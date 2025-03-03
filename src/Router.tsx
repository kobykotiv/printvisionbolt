import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Strategy from './pages/Strategy';
import Pricing from './pages/Pricing';
import FAQ from './pages/FAQ';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import { CollectionsPage } from './pages/CollectionsPage';
import { DesignsPage } from './pages/DesignsPage';
import NotFound from './components/NotFound';
import Collections from './pages/Collections';
import {Designs} from './pages/Designs';
import {Templates} from './pages/Templates';
import {Products} from './pages/Products';
import {Settings} from './pages/Settings';
import {Dashboard} from './pages/Dashboard';
import { Navigate } from 'react-router-dom';

// Import components for new routes
import {CollectionDetails} from './pages/CollectionDetails';
import {TemplateDetails} from './pages/TemplateDetails';

function Router() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/strategy" element={<Strategy />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />

      {/* Protected routes */}
<<<<<<< HEAD
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/collections/:id" element={<CollectionDetails />} />
        <Route path="/designs" element={<Designs />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/templates/:id" element={<TemplateDetails />} />
        <Route path="/products/*" element={<Products />} />
        <Route path="/stores/*" element={<Navigate to="/products" />} /> 
        <Route path="/sync/*" element={<Navigate to="/products/sync" />} />
        <Route path="/drops/*" element={<Navigate to="/products/drops" />} />
        <Route path="/settings" element={<Settings />} />
=======
      <Route path="/app" element={<DashboardLayout />}>
        <Route path="collections" element={<CollectionsPage />} />
        <Route path="designs" element={<DesignsPage />} />
        {/* Add other routes here */}
>>>>>>> parent of 2d55731 (Revert "implementing cms")
      </Route>

      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default Router;
