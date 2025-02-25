import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import Landing from './pages/Landing';

const Router = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/auth/login" element={<div>Login Page</div>} />
      <Route path="/signup" element={<div>Sign Up Page</div>} />

      {/* Protected routes */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<div>Dashboard Content</div>} />
        <Route path="/settings" element={<div>Settings Content</div>} />
        <Route path="/designs" element={<div>Designs Content</div>} />
        <Route path="/collections" element={<div>Collections Content</div>} />
      </Route>

      {/* 404 route */}
      <Route path="*" element={<div>404 - Not Found</div>} />
    </Routes>
  );
};

export default Router;
