import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicRoute } from './components/PublicRoute';
import { useAuth } from './contexts/AuthContext';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NotFound } from './components/NotFound';
import { Landing } from './pages/Landing';
import { DemoLogin } from './pages/DemoLogin';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { ForgotPassword } from './pages/ForgotPassword';
import { Dashboard } from './pages/Dashboard';
import { Brands } from './pages/Brands';
import { Templates } from './pages/Templates';
import { Designs } from './pages/Designs';
import { CollectionDetails } from './pages/CollectionDetails';
import { Products } from './pages/Products';
import { Collections } from './pages/Collections';
import { Settings } from './pages/Settings';
import { SettingsProvider } from './contexts/SettingsContext';
import { BrandAssets } from './pages/BrandAssets';
import { AuthProvider } from './contexts/AuthContext';
import { BulkUpload } from './pages/BulkUpload';
import { ShopProvider } from './contexts/ShopContext';

interface AuthCheckProps {
  children: React.ReactNode;
}

function AuthCheck({ children }: AuthCheckProps) {
  const { user } = useAuth();
  const location = useLocation();

  React.useEffect(() => {
    if (!user && !location.pathname.startsWith('/login') && !location.pathname.startsWith('/signup')) {
      // Clear any sensitive data from localStorage
      localStorage.removeItem('lastUsedShopId');
    }
  }, [user, location]);

  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <ShopProvider>
        <SettingsProvider>
          <ErrorBoundary>
            <Router>
              <AuthCheck>
                <Routes>
                {/* Public Routes */}
                <Route path="/" element={
                  <PublicRoute>
                    <Landing />
                  </PublicRoute>
                } />
                <Route path="/login" element={
                  <PublicRoute>
                    <SignIn />
                  </PublicRoute>
                } />
                <Route path="/demo-login" element={
                  <PublicRoute>
                    <DemoLogin />
                  </PublicRoute>
                } />
                <Route path="/forgot-password" element={
                  <PublicRoute>
                    <ForgotPassword />
                  </PublicRoute>
                } />
                <Route path="/signup" element={
                  <PublicRoute>
                    <SignUp />
                  </PublicRoute>
                } />

                {/* Protected Routes */}
                <Route path="/app/*" element={
                  <ProtectedRoute>
                    <Layout>
                      <React.Suspense fallback={
                        <div className="min-h-screen flex items-center justify-center">
                          <LoadingSpinner size="lg" />
                        </div>
                      }>
                        <Routes>
                          <Route index element={<Dashboard />} />
                          <Route path="brands" element={<Brands />} />
                          <Route path="templates" element={<Templates />} />
                          <Route path="designs" element={<Designs />} />
                          <Route path="bulk-upload" element={<BulkUpload />} />
                          <Route path="products" element={<Products />} />
                          <Route path="collections/:id" element={<CollectionDetails />} />
                          <Route path="collections" element={<Collections />} />
                          <Route path="brand-assets" element={<BrandAssets />} />
                          <Route path="settings" element={<Settings />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </React.Suspense>
                    </Layout>
                  </ProtectedRoute>
                } />

                {/* Fallback Routes */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthCheck>
            </Router>
          </ErrorBoundary>
        </SettingsProvider>
      </ShopProvider>
    </AuthProvider>
  );
}

export default App;