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
      <Route path="/app" element={<DashboardLayout />}>
        <Route path="collections" element={<CollectionsPage />} />
        <Route path="designs" element={<DesignsPage />} />
        {/* Add other routes here */}
      </Route>

      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default Router;
